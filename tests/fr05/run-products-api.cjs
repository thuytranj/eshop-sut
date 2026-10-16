const fs = require('node:fs'), path = require('node:path');
function buildUrl(base, query) {
  const url = new URL(base.replace(/\/$/, '') + '/products');
  if (query !== null) url.searchParams.set('search', query);
  return url.toString();
}
function inspectResponse(status, body, expectedIds) {
  let rows;
  try { rows = JSON.parse(body); } catch (_) { rows = null; }
  const array = Array.isArray(rows), ids = array ? rows.map(p => p.id).sort((a,b)=>a-b) : null;
  return [
    { name:'HTTP status', expected:200, actual:status, passed:status===200 },
    { name:'JSON array', expected:true, actual:array, passed:array },
    { name:'exact IDs including multiplicity', expected:expectedIds.slice().sort((a,b)=>a-b), actual:ids,
      passed:JSON.stringify(ids)===JSON.stringify(expectedIds.slice().sort((a,b)=>a-b)) }
  ];
}
async function main() {
  const args=process.argv.slice(2), get=name=>args[args.indexOf(name)+1];
  const runId=get('--run-id');
  if(!/^[a-z0-9][a-z0-9-]{0,70}$/.test(runId||'')) throw Error('invalid run-id');
  const root=path.resolve(__dirname,'../..'), suite=JSON.parse(fs.readFileSync(get('--suite')));
  const base=get('--base-url'), dir=path.join(root,'docs/testing/fr05/evidence',runId);
  const results=[];
  fs.mkdirSync(path.join(dir,'api'),{recursive:true});
  for(const c of suite.cases.filter(c=>c.interface==='API')) {
    const f=path.join(dir,'api',c.id+'.json');
    if(fs.existsSync(f)) throw Error('refuse overwrite evidence '+f);
    const url=buildUrl(base,c.input.search), start=new Date().toISOString();
    let status='Blocked',actual,assertions=[],raw={},reason='';
    try {
      const control=await fetch(new URL('/__control',base),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({fixtureId:c.fixtureId,mode:'normal'})});
      if(!control.ok)throw Error('fixture reset failed '+control.status);
      raw.reset=await control.json();
      const response=await fetch(url);const body=await response.text();
      raw={...raw,url,status:response.status,body,at:start};
      assertions=inspectResponse(response.status,body,c.expected.ids);
      status=assertions.every(a=>a.passed)?'Passed':'Failed';
      actual=`HTTP ${response.status}; body=${body}`;
    }catch(e){actual=e.message;reason='API_ENVIRONMENT';raw={...raw,url,error:e.message,at:start};}
    fs.writeFileSync(f,JSON.stringify(raw,null,2)+'\n');
    results.push({runId,caseId:c.id,interface:'API',platform:c.platform,actual,assertions,status,evidence:[path.relative(root,f)],bugIds:[],reason});
  }
  fs.writeFileSync(path.join(dir,'api-observations.json'),JSON.stringify(results,null,2)+'\n');
  console.log(JSON.stringify(results.reduce((n,r)=>(n[r.status]=(n[r.status]||0)+1,n),{})));
}
module.exports={buildUrl,inspectResponse};
if(require.main===module)main().catch(e=>{console.error(e);process.exitCode=1;});
