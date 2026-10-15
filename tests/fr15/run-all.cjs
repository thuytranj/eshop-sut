const fs=require('node:fs'),path=require('node:path'),net=require('node:net');
const {spawn,spawnSync,execFileSync}=require('node:child_process');
const {prepareEnvironment,workingHashes,hash,repoRoot}=require('./prepare-environment.cjs');
const {snapshotProducts}=require('./fixture-store.cjs');
const {reconcile,stable}=require('./validate-suite.cjs');
const timestamp=()=>new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Ho_Chi_Minh',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}).format(new Date()).replace(' ','T')+'+07:00';
async function runCases(cases,execute){const out=[];for(const c of cases){try{out.push(await execute(c));}catch(e){out.push({caseId:c.id,attempted:true,startedAt:timestamp(),endedAt:timestamp(),status:'Blocked',blockReason:'environment/harness: '+e.message,actual:{error:e.message},evidence:[],exercisedObligations:[]});}}return out;}
const free=port=>new Promise((resolve,reject)=>{const server=net.createServer();server.once('error',reject);server.listen({port,host:'::'},()=>server.close(resolve));});
function childCommand(command,args,options){return new Promise((resolve,reject)=>{const p=spawn(command,args,options);p.once('error',reject);p.once('exit',(code,signal)=>resolve({code,signal}));});}
async function ready(url,child,backendDir){let last='';for(let n=0;n<120;n++){if(child.exitCode!==null)throw Error('Owned server exited before readiness');try{const r=await fetch(url,{signal:AbortSignal.timeout(1000)});if(r.ok){if(backendDir){const products=await snapshotProducts(backendDir);if(products.length!==5)throw Error('Seed not finished');}return;}}catch(e){last=e.message;}await new Promise(r=>setTimeout(r,250));}throw Error('Readiness timeout: '+last);}
async function main(){
 const args=process.argv.slice(2),get=(k,d)=>args.includes(k)?args[args.indexOf(k)+1]:d;
 if(args.includes('--ui-self-check')){process.exitCode=spawnSync(get('--python','python3'),[path.join(__dirname,'ui-sync.test.py')],{stdio:'inherit'}).status??1;return;}
 if(args.includes('--self-check')){process.exitCode=spawnSync(process.execPath,['--test',path.join(__dirname,'harness.test.cjs')],{stdio:'inherit'}).status??1;return;}
 const suitePath=path.resolve(get('--suite',path.join(__dirname,'suite.json'))),suite=JSON.parse(fs.readFileSync(suitePath));
 const root=get('--root'),out=path.resolve(get('--out')),runId=get('--run-id');if(!root||!runId)throw Error('Need --root --out --run-id');if(fs.existsSync(out))throw Error('Refuse overwrite evidence');
 await free(3000);await free(5174); // Refuse unknown processes before preparing or sending requests.
 const prepared=prepareEnvironment(root);fs.mkdirSync(out,{recursive:true});for(const layer of ['api','web'])fs.mkdirSync(path.join(out,layer));
 const manifest={runId,startedAt:timestamp(),timezone:'Asia/Ho_Chi_Minh',commit:execFileSync('git',['rev-parse','HEAD'],{cwd:repoRoot,encoding:'utf8'}).trim(),dirtyPaths:execFileSync('git',['status','--short'],{cwd:repoRoot,encoding:'utf8'}).trim().split('\n'),suiteHash:hash(suitePath),preparation:prepared,urls:{api:'http://localhost:3000',web:'http://127.0.0.1:5174'},runtime:{node:process.version,python:spawnSync(get('--python','python3'),['--version'],{encoding:'utf8'}).stdout.trim()},resetStrategy:'transaction after startup; per-case products/categories + auth counters',processes:[]};
 manifest.harnessHashes=Object.fromEntries(fs.readdirSync(__dirname).filter(f=>/\.(cjs|py|json)$/.test(f)).map(f=>[f,hash(path.join(__dirname,f))]));manifest.adminHashes=Object.fromEntries(['src/App.jsx','package-lock.json','vite.config.js'].map(f=>[f,hash(path.join(repoRoot,'frontend-admin',f))]));
 const owned=[],handles=[];const save=()=>fs.writeFileSync(path.join(out,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');save();
 const start=(command,argv,cwd,name)=>{const log=fs.openSync(path.join(out,name+'.log'),'wx');handles.push(log);const child=spawn(command,argv,{cwd,stdio:['ignore',log,log],detached:true,env:{...process.env,TZ:'Asia/Ho_Chi_Minh'}});owned.push(child);manifest.processes.push({name,pid:child.pid,cwd,command,argv});save();return child;};
 try{
  const backend=start(process.execPath,['server.js'],prepared.backendDir,'backend');await ready('http://localhost:3000/api/products',backend,prepared.backendDir);
  const admin=start('npm',['run','dev','--','--host','127.0.0.1'],path.join(repoRoot,'frontend-admin'),'admin');await ready('http://127.0.0.1:5174',admin);
  for(const layer of ['api','web']){
   const log=fs.openSync(path.join(out,layer,'runner.log'),'wx');handles.push(log);
   const common=['--suite',suitePath,'--backend-dir',prepared.backendDir,'--base-url',manifest.urls[layer==='api'?'api':'web'],'--out',path.join(out,layer),'--run-id',runId];
   const result=await childCommand(layer==='api'?process.execPath:get('--python','python3'),[path.join(__dirname,layer==='api'?'run-products-api.cjs':'run-products-web.py'),...common,...(layer==='web'?['--api-url',manifest.urls.api]:[])],{cwd:repoRoot,stdio:['ignore',log,log]});
   manifest[layer+'Runner']=result;save();
  }
 }catch(e){manifest.environmentError=e.stack;}finally{
  for(const layer of ['api','web']){
   const f=path.join(out,layer,'observations.json');let observations=fs.existsSync(f)?JSON.parse(fs.readFileSync(f)):[];const seen=new Set(observations.map(o=>o.caseId));
   for(const c of suite.filter(c=>c.layer===layer.toUpperCase()&&!seen.has(c.id)))observations.push({caseId:c.id,attempted:false,status:'Blocked',actual:{error:manifest.environmentError||'runner exited without result'},blockReason:manifest.environmentError||'runner exited without result',evidence:[path.relative(repoRoot,path.join(out,'manifest.json'))],exercisedObligations:[]});
   fs.writeFileSync(f,JSON.stringify(observations,null,2)+'\n');
  }
  for(const child of owned.reverse())if(child.exitCode===null){try{process.kill(-child.pid,'SIGTERM');}catch{}await new Promise(r=>setTimeout(r,200));}
  for(const fd of handles)fs.closeSync(fd);
  manifest.workingHashesAfter=workingHashes();manifest.workingDbUnchanged=stable(manifest.workingHashesAfter)===stable(prepared.workingHashes);manifest.suiteUnchanged=hash(suitePath)===manifest.suiteHash;manifest.endedAt=timestamp();
  const observations=['api','web'].flatMap(layer=>JSON.parse(fs.readFileSync(path.join(out,layer,'observations.json'))));const r=reconcile(suite,observations);manifest.stats=r.stats;manifest.reconciliationErrors=r.errors;
  if(!manifest.workingDbUnchanged||!manifest.suiteUnchanged)manifest.reconciliationErrors.push('Preservation hash mismatch');save();console.log(JSON.stringify({runId,stats:r.stats,errors:manifest.reconciliationErrors,workingDbUnchanged:manifest.workingDbUnchanged},null,2));
  process.exitCode=manifest.environmentError||r.errors.length||r.stats.blocked||r.stats.notRun?2:r.stats.failed?1:0;
 }
}
if(require.main===module)main().catch(e=>{console.error(e);process.exitCode=2;});
module.exports={runCases,timestamp};
