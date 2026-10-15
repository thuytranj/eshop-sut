const fs=require('node:fs'),path=require('node:path');
const {resetFixture,snapshotProducts}=require('./fixture-store.cjs');
const {safeBackend,repoRoot}=require('./prepare-environment.cjs');
const {assess}=require('./assert-products.cjs');const {runCases,timestamp}=require('./run-all.cjs');
async function request(base,method,url,body,token){const r=await fetch(base+url,{method,headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},...(body!==undefined?{body:JSON.stringify(body)}:{}),signal:AbortSignal.timeout(10000)});const text=await r.text();let data;try{data=JSON.parse(text);}catch{data=text;}return {statusCode:r.status,body:data};}
async function main(){
 const args=process.argv.slice(2),get=k=>args[args.indexOf(k)+1];const backend=get('--backend-dir'),base=get('--base-url'),out=get('--out'),runId=get('--run-id'),suite=JSON.parse(fs.readFileSync(get('--suite'))).filter(c=>c.layer==='API');safeBackend(backend);
 const login=async(role)=>{const r=await request(base,'POST','/api/login',{email:role==='admin'?'admin@eshop.com':'test@eshop.com',password:role==='admin'?'Admin123!':'Test1234!'});if(!r.body.token)throw Error('Login dependency failed');return r.body.token;};
 const observations=await runCases(suite,async c=>{
  const o={caseId:c.id,runId,attempted:true,startedAt:timestamp(),inputIntended:c.input,inputEffective:c.input,request:null,response:null,stateBefore:null,stateAfter:null,uiBeforeReload:null,uiAfterReload:null,actual:null,status:'Not Run',blockReason:null,evidence:[],exercisedObligations:[]};
  await resetFixture(backend,path.join(__dirname,'fixtures.json'),c.fixtureKey);o.stateBefore=await snapshotProducts(backend);
  const auth=c.input.auth,token=auth==='none'?null:auth==='invalid'?'invalid-token':await login(auth);
  const method={Create:'POST',Read:'GET',Update:'PUT',Delete:'DELETE'}[c.action],url='/api/products'+(c.action==='Create'||c.action==='Read'&&c.input.mode==='list'?'':'/'+c.input.target);
  const body=['Create','Update'].includes(c.action)?c.input.body:undefined;
  o.request={method,url,headers:{Authorization:token?'Bearer [REDACTED]':null},body};o.response=await request(base,method,url,body,token);o.stateAfter=await snapshotProducts(backend);
  o.apiReadback=await request(base,'GET','/api/products');
  Object.assign(o,assess(c,o));o.actual={http:o.response.statusCode,body:o.response.body,failures:o.failures,beforeCount:o.stateBefore.length,afterCount:o.stateAfter.length};o.endedAt=timestamp();
  if(o.status!=='Blocked')o.exercisedObligations=c.obligations;
  const detail=path.join(out,c.id+'.json');o.evidence=[path.relative(repoRoot,detail)];fs.writeFileSync(detail,JSON.stringify(o,null,2)+'\n');console.log(c.id,o.status,(o.failures||[]).join(','));return o;
 });
 fs.writeFileSync(path.join(out,'observations.json'),JSON.stringify(observations,null,2)+'\n');
}
if(require.main===module)main().catch(e=>{console.error(e);process.exitCode=2;});
