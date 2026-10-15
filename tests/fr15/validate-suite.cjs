const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const {spawnSync}=require('node:child_process');
const fields=['id','sourceCaseIds','techniques','layer','action','rules','obligations','oracleStatus','preconditions','fixtureKey','input','steps','expected','dependencies','actual','status','evidence'];
const stable=o=>JSON.stringify(o,(_,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.entries(v).sort(([a],[b])=>a.localeCompare(b))):v);
const key=c=>stable([c.layer,c.action,c.preconditions,c.fixtureKey,c.input,c.steps,c.expected?.outcome,c.expected?.stateContract]);
function validate(suite,sources,obligations,fixtures){
 const e=[];if(!Array.isArray(suite)||!suite.length)return ['Suite must be nonempty'];
 const ids=new Set(),mapped=new Set(),covered=new Set();const sm=new Map(sources.map(s=>[s.id,s]));const om=new Map(obligations.map(o=>[o.id,o]));
 if(sm.size!==sources.length)e.push('Duplicate source ID');if(om.size!==obligations.length)e.push('Duplicate obligation ID');
 for(const c of suite){
  for(const f of fields)if(!(f in c))e.push(`${c.id}: missing ${f}`);
  if(!/^FR15-TC-\d{3}$/.test(c.id)||ids.has(c.id))e.push(`Invalid/duplicate canonical ID ${c.id}`);ids.add(c.id);
  if(!['API','WEB'].includes(c.layer)||!['Create','Read','Update','Delete'].includes(c.action))e.push(`${c.id}: invalid layer/action`);
  if(!['confirmed','derived','unresolved'].includes(c.oracleStatus))e.push(`${c.id}: invalid oracle`);
  if(!(c.fixtureKey in fixtures))e.push(`${c.id}: unknown fixture`);
  if(!c.preconditions||!c.steps?.length||!c.expected?.outcome)e.push(`${c.id}: missing preconditions/steps/expected`);
  if(c.status!=='Not Run'||c.actual!==null||!Array.isArray(c.evidence)||c.evidence.length)e.push(`${c.id}: frozen baseline modified`);
  if(!c.rules?.length||c.rules.some(r=>!/^FR15-R0[1-8]$|^FR12-DEP-WRITE$/.test(r)))e.push(`${c.id}: unknown/missing rule`);
  if(!c.sourceCaseIds?.length||!c.obligations?.length)e.push(`${c.id}: empty provenance/obligation`);
  const expectedTech=new Set();
  for(const s of c.sourceCaseIds||[]){
   if(mapped.has(s)||!sm.has(s))e.push(`${c.id}: duplicate/unknown source ${s}`);mapped.add(s);
   const source=sm.get(s);if(!source)continue;
   if(key(source)!==key(c))e.push(`${c.id}: source semantic mismatch ${s}`);
   for(const t of source.techniques)expectedTech.add(t);
   for(const r of source.rules)if(!c.rules?.includes(r))e.push(`${c.id}: lost rule ${r}`);
   for(const o of source.obligations)if(!c.obligations?.includes(o))e.push(`${c.id}: lost obligation ${o}`);
  }
  if(stable([...expectedTech].sort())!==stable([...(c.techniques||[])].sort()))e.push(`${c.id}: technique mismatch`);
  for(const o of c.obligations||[]){const ob=om.get(o);if(!ob||!c.sourceCaseIds.includes(ob.sourceCaseId))e.push(`${c.id}: unknown/misattributed obligation ${o}`);covered.add(o);}
 }
 for(const s of sources)if(!mapped.has(s.id))e.push(`Unmapped source ${s.id}`);
 for(const o of obligations)if(!covered.has(o.id))e.push(`Unmapped obligation ${o.id}`);
 return e;
}
function reconcile(suite,observations){
 const errors=[],seen=new Set(),exercised=new Set();const map=new Map(suite.map(c=>[c.id,c]));const stats={designed:suite.length,attempted:0,executed:0,passed:0,failed:0,blocked:0,notRun:0};
 for(const o of observations){
  const c=map.get(o.caseId);if(!c||seen.has(o.caseId)){errors.push(`Unknown/duplicate result ${o.caseId}`);continue;}seen.add(o.caseId);
  const statusKey={'Passed':'passed','Failed':'failed','Blocked':'blocked','Not Run':'notRun'}[o.status];
  if(!statusKey){errors.push(`Invalid result status ${o.caseId}`);continue;}stats[statusKey]++;
  if(o.attempted)stats.attempted++;
  if(['Passed','Failed'].includes(o.status)){
   stats.executed++;
   if(o.actual==null||!o.evidence?.length)errors.push(`Missing actual/evidence ${o.caseId}`);
   if(c.oracleStatus==='unresolved')errors.push(`Unresolved oracle received verdict ${o.caseId}`);
  }
  if(o.status==='Blocked'&&!o.blockReason)errors.push(`Missing blocker ${o.caseId}`);
  for(const p of o.evidence||[])if(!fs.existsSync(path.resolve(p)))errors.push(`Missing evidence ${p}`);
  for(const ob of o.exercisedObligations||[]){if(!c.obligations.includes(ob))errors.push(`Foreign obligation ${ob}`);else exercised.add(ob);}
 }
 for(const c of suite)if(!seen.has(c.id)){errors.push(`Missing result ${c.id}`);stats.notRun++;}
 return {errors,stats,exercised:[...exercised].sort()};
}
if(require.main===module){
 const args=process.argv.slice(2);if(args.includes('--self-check')){const r=spawnSync(process.execPath,['--test',path.join(__dirname,'harness.test.cjs')],{stdio:'inherit'});process.exit(r.status??1);}
 const arg=(k,d)=>{const i=args.indexOf(k);return i>=0?args[i+1]:d;};
 const load=f=>JSON.parse(fs.readFileSync(f,'utf8'));
 const sp=arg('--suite',path.join(__dirname,'suite.json'));const suite=load(sp),sources=load(arg('--sources',path.join(__dirname,'source-cases.json'))),obs=load(arg('--obligations',path.join(__dirname,'obligations.json')));
 const errors=validate(suite,sources,obs,load(path.join(__dirname,'fixtures.json')));let report={cases:suite.length,sourceCases:sources.length,obligations:obs.length,suiteHash:crypto.createHash('sha256').update(fs.readFileSync(sp)).digest('hex')};
 const results=arg('--results',null);if(results){const observations=['api','web'].flatMap(layer=>load(path.join(results,layer,'observations.json')));const r=reconcile(suite,observations);errors.push(...r.errors);report={...report,...r};}
 console.log(JSON.stringify({...report,errors},null,2));process.exit(errors.length?1:0);
}
module.exports={validate,reconcile,key,stable};
