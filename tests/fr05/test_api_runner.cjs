const {test}=require('node:test');const assert=require('node:assert/strict');
let runner;try{runner=require('./run-products-api.cjs');}catch(e){runner={};}
test('URL builder preserves reserved characters instead of splitting query',()=>{
 assert.equal(typeof runner.buildUrl,'function','runner URL builder missing');
 assert.equal(runner.buildUrl('http://localhost:3002/api','A&B'),'http://localhost:3002/api/products?search=A%26B');
 assert.equal(runner.buildUrl('http://localhost:3002/api','A+B'),'http://localhost:3002/api/products?search=A%2BB');
 assert.equal(runner.buildUrl('http://localhost:3002/api','A#B'),'http://localhost:3002/api/products?search=A%23B');
 assert.equal(runner.buildUrl('http://localhost:3002/api',null),'http://localhost:3002/api/products');
});
test('response inspector rejects non-JSON errors, wrong IDs and duplicate IDs',()=>{
 assert.equal(typeof runner.inspectResponse,'function','response inspector missing');
 assert.ok(runner.inspectResponse(200,'[{"id":201}]',[201]).every(a=>a.passed));
 assert.ok(runner.inspectResponse(500,'<h1>Error</h1>',[201]).some(a=>!a.passed));
 assert.ok(runner.inspectResponse(200,'[{"id":202}]',[201]).some(a=>!a.passed));
 assert.ok(runner.inspectResponse(200,'[{"id":201},{"id":201}]',[201]).some(a=>!a.passed));
});
