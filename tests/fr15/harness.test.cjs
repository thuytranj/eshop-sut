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
