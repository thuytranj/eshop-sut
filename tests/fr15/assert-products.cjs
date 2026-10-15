const fs=require('node:fs');const {stable}=require('./validate-suite.cjs');
const same=(a,b)=>stable(a)===stable(b);
function matches(p,body){return ['name','price','description','imageUrl','category_id'].every(k=>k in body&&(['price','category_id'].includes(k)?Number(p[k])===Number(body[k]):p[k]===body[k]));}
function rendered(rows){return rows.map(p=>({name:p.name,price:Number(p.price),alt:p.name})).sort((a,b)=>stable(a).localeCompare(stable(b)));}
function assess(c,o){
 if(c.oracleStatus==='unresolved')return {status:'Blocked',blockReason:'oracle-unresolved',failures:[],description:'Observed characterization; oracle/precision unresolved'};
 const before=o.stateBefore,after=o.stateAfter;if(!Array.isArray(before)||!Array.isArray(after))return {status:'Blocked',blockReason:'environment-state-unavailable',failures:[]};
 const fail=[],check=(yes,id)=>{if(!yes)fail.push(id);};const response=o.response||{};const success=response.statusCode>=200&&response.statusCode<300&&!response.body?.error;
 const target=c.input.target,body=c.input.body;const nonTarget=arr=>arr.filter(p=>p.id!==target);
 if(c.expected.outcome==='reject'){
  check(same(before,after),'rejected-state-unchanged');check(o.htmlBlocked===true||!success,'rejection-signaled');
 }else{
  if(c.action==='Read'){
   check(same(before,after),'read-state-unchanged');
   if(c.layer==='API'){check(success,'read-response-success');check(c.input.mode==='list'?Array.isArray(response.body)&&same(response.body,before):response.body?.id===target&&matches(response.body,before.find(p=>p.id===target)),'read-values-correct');}
  }else{
   check(success,'mutation-response-success');
   if(c.action==='Create'){
    const added=after.filter(p=>!before.some(b=>b.id===p.id));check(added.length===1&&after.length===before.length+1,'create-exactly-one');check(added.length===1&&matches(added[0],body),'target-values-correct');check(before.every(p=>same(p,after.find(x=>x.id===p.id))),'non-target-preserved');
   }else if(c.action==='Update'){
    check(after.length===before.length&&same(nonTarget(before),nonTarget(after)),'non-target-preserved');check(!!after.find(p=>p.id===target)&&matches(after.find(p=>p.id===target),body),'target-values-correct');
   }else if(c.action==='Delete'){
    check(!after.some(p=>p.id===target)&&after.length===before.length-1,'delete-exact-target');check(same(nonTarget(before),after),'non-target-preserved');
   }
  }
 }
 if(o.apiReadback){const r=o.apiReadback;check(r.statusCode>=200&&r.statusCode<300&&Array.isArray(r.body)&&same([...r.body].sort((a,b)=>a.id-b.id),after),'api-readback-consistent');}
 if(c.layer==='WEB'){
  const expected=c.expected.outcome==='reject'?before:after;
  for(const [key,id] of [['uiBeforeReload','ui-immediate-correct'],['uiAfterReload','ui-reload-correct']]){
   if(Array.isArray(o[key]))check(same(o[key].map(p=>({name:p.name,price:Number(p.price),alt:p.alt})).sort((a,b)=>stable(a).localeCompare(stable(b))),rendered(expected)),id);
   else check(false,id);
  }
 }
 return {status:fail.length?'Failed':'Passed',blockReason:null,failures:fail};
}
if(require.main===module){const {c,o}=JSON.parse(fs.readFileSync(0,'utf8'));console.log(JSON.stringify(assess(c,o)));}
module.exports={assess};
