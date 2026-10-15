const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const validatorPath=path.join(__dirname,'validate-suite.cjs');
function subject(){return fs.existsSync(validatorPath)?require(validatorPath):{validate:()=>['validator not implemented']};}
function fixture(){
 const source={id:'FR15-DT-001',sourceCaseIds:['FR15-DT-001'],techniques:['Domain Testing'],layer:'API',action:'Create',rules:['FR15-R01'],obligations:['FR15-OBL-DT-001'],oracleStatus:'confirmed',preconditions:'reset',fixtureKey:'baseline',input:{body:{name:'A',price:1,category_id:10},auth:'admin'},steps:['POST','read back'],expected:{outcome:'accept'},dependencies:[],actual:null,status:'Not Run',evidence:[]};
 const canonical={...source,id:'FR15-TC-001'};
 return {suite:[canonical],sources:[source],obligations:[{id:'FR15-OBL-DT-001',sourceCaseId:source.id,technique:'Domain Testing'}],fixtures:{baseline:{}}};
}
function validate(f){return subject().validate(f.suite,f.sources,f.obligations,f.fixtures);}
test('accepts a complete frozen suite with preserved provenance',()=>assert.deepEqual(validate(fixture()),[]));
test('rejects a duplicated canonical ID',()=>{const f=fixture();f.suite.push(structuredClone(f.suite[0]));assert.ok(validate(f).length);});
test('rejects unmapped source and lost obligation',()=>{const f=fixture();f.suite[0].sourceCaseIds=[];f.suite[0].obligations=[];assert.ok(validate(f).length);});
test('rejects false passed baseline and unknown fixture',()=>{const f=fixture();f.suite[0].status='Passed';f.suite[0].fixtureKey='unknown';assert.ok(validate(f).length);});
test('rejects technique mismatch after deduplication',()=>{const f=fixture();f.suite[0].techniques=['BVA'];assert.ok(validate(f).length);});
test('rejects missing steps and expected result',()=>{const f=fixture();delete f.suite[0].steps;delete f.suite[0].expected;assert.ok(validate(f).length);});
module.exports={fixture};
const os=require('node:os');
function prep(){const p=path.join(__dirname,'prepare-environment.cjs');return fs.existsSync(p)?require(p):{prepareEnvironment:()=>{throw Error('environment preparation not implemented');}};}
test('creates byte-identical backend copy without copying working DB',()=>{
 const root=path.join(fs.mkdtempSync(path.join(os.tmpdir(),'fr15-guard-')),'new');
 try{const result=prep().prepareEnvironment(root);assert.equal(fs.readFileSync(path.join(result.backendDir,'server.js'),'utf8'),fs.readFileSync(path.join(__dirname,'../../backend/server.js'),'utf8'));assert.equal(fs.existsSync(path.join(result.backendDir,'database.sqlite')),false);assert.throws(()=>prep().prepareEnvironment(root));}finally{fs.rmSync(path.dirname(root),{recursive:true,force:true});}
});
test('refuses working backend and symlink alias before touching data',()=>{
 const working=path.resolve(__dirname,'../../backend');assert.throws(()=>prep().prepareEnvironment(working));
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'fr15-alias-'));try{fs.symlinkSync(working,path.join(root,'alias'));assert.throws(()=>prep().prepareEnvironment(path.join(root,'alias')));}finally{fs.rmSync(root,{recursive:true,force:true});}
});
function assessor(){const p=path.join(__dirname,'assert-products.cjs');return fs.existsSync(p)?require(p).assess:()=>({failures:['assessor not implemented']});}
const a={id:101,name:'A',price:10,category_id:10,description:'a',imageUrl:'img'}, b={id:202,name:'B',price:20,category_id:20,description:'b',imageUrl:'img'};
test('accepts correctly isolated update but detects a non-target field change',()=>{
 const c={action:'Update',input:{target:101,body:{name:'New',price:11,category_id:10,description:'a',imageUrl:'img'}},expected:{outcome:'accept'},oracleStatus:'confirmed'};
 const o={stateBefore:[a,b],stateAfter:[{...a,name:'New',price:11},b],response:{statusCode:200,body:{message:'updated'}}};
 assert.deepEqual(assessor()(c,o).failures,[]);assert.ok(assessor()(c,{...o,stateAfter:[o.stateAfter[0],{...b,name:'New'}]}).failures.includes('non-target-preserved'));
});
test('does not infer rejection from an HTTP success or unchanged count',()=>{
 const c={action:'Update',input:{target:101,body:{price:0}},expected:{outcome:'reject'},oracleStatus:'confirmed'};
 assert.ok(assessor()(c,{stateBefore:[a,b],stateAfter:[{...a,price:0},b],response:{statusCode:200,body:{message:'updated'}}}).failures.length);
});
test('keeps unresolved probes without a pass/fail verdict',()=>assert.equal(assessor()({oracleStatus:'unresolved'},{stateBefore:[],stateAfter:[]}).status,'Blocked'));
function orchestrator(){const p=path.join(__dirname,'run-all.cjs');return fs.existsSync(p)?require(p):{runCases:async()=>[]};}
test('continues after a failed case and records environment errors as blocked',async()=>{
 const result=await orchestrator().runCases([{id:'a'},{id:'b'},{id:'c'}],async c=>{if(c.id==='b')throw Error('fixture unavailable');return {caseId:c.id,status:c.id==='a'?'Failed':'Passed'};});
 assert.deepEqual(result.map(r=>[r.caseId,r.status]),[['a','Failed'],['b','Blocked'],['c','Passed']]);assert.match(result[1].blockReason,/fixture unavailable/);
});
test('detects immediate UI drift even when persisted update is correct',()=>{
 const c={layer:'WEB',action:'Update',input:{target:101,body:{name:'New',price:10,category_id:10,description:'a',imageUrl:'img'}},expected:{outcome:'accept'},oracleStatus:'confirmed'};
 const o={stateBefore:[a,b],stateAfter:[{...a,name:'New'},b],response:{statusCode:200},uiBeforeReload:[{name:'New',price:10,alt:'New',src:'img'},{name:'New',price:20,alt:'New',src:'img'}],uiAfterReload:[{name:'New',price:10,alt:'New',src:'img'},{name:'B',price:20,alt:'B',src:'img'}]};
 assert.deepEqual(assessor()(c,o).failures,['ui-immediate-correct']);
});
test('requires API readback to reflect the persisted state',()=>{
 const c={layer:'API',action:'Read',input:{target:101,mode:'list'},expected:{outcome:'accept'},oracleStatus:'confirmed'};
 const o={stateBefore:[a,b],stateAfter:[a,b],response:{statusCode:200,body:[a,b]},apiReadback:{statusCode:200,body:[]}};
 assert.ok(assessor()(c,o).failures.includes('api-readback-consistent'));
});
test('rejects incorrect rendered image sources even when names/prices/alt match',()=>{
 const c={layer:'WEB',action:'Read',input:{mode:'list'},expected:{outcome:'accept'},oracleStatus:'confirmed'};
 const o={stateBefore:[a],stateAfter:[a],uiBeforeReload:[{name:'A',price:10,alt:'A',src:'wrong-image'}],uiAfterReload:[{name:'A',price:10,alt:'A',src:'wrong-image'}]};
 assert.deepEqual(assessor()(c,o).failures,['ui-immediate-correct','ui-reload-correct']);
});
test('does not treat a missing response as positive evidence of rejection',()=>{
 const c={layer:'WEB',action:'Create',input:{body:{name:''}},expected:{outcome:'reject'},oracleStatus:'confirmed'};
 const row={name:'A',price:10,alt:'A',src:'img'};
 const o={stateBefore:[a],stateAfter:[a],htmlBlocked:false,response:null,uiBeforeReload:[row],uiAfterReload:[row]};
 assert.equal(assessor()(c,o).status,'Blocked');
 assert.equal(assessor()(c,{...o,htmlBlocked:true}).status,'Passed');
});
test('a representable positive half-price has an acceptance oracle',()=>{
 const c=JSON.parse(fs.readFileSync(path.join(__dirname,'suite.json'))).find(c=>c.layer==='API'&&c.action==='Create'&&c.input.body.price===0.5);
 const created={id:304,...c.input.body};
 const o={stateBefore:[a,b],stateAfter:[a,b,created],response:{statusCode:200,body:{id:304}}};
 assert.equal(assessor()(c,o).status,'Passed');
});
