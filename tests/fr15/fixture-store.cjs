const fs=require('node:fs'),path=require('node:path');
const {safeBackend,repoRoot}=require('./prepare-environment.cjs');
const sqlite3=require(path.join(repoRoot,'backend/node_modules/sqlite3'));
function open(dir){return new sqlite3.Database(path.join(safeBackend(dir),'database.sqlite'));}
const run=(db,sql,args=[])=>new Promise((resolve,reject)=>db.run(sql,args,function(e){e?reject(e):resolve(this);}));
const all=(db,sql)=>new Promise((resolve,reject)=>db.all(sql,[],(e,r)=>e?reject(e):resolve(r)));
const close=db=>new Promise((resolve,reject)=>db.close(e=>e?reject(e):resolve()));
async function resetFixture(dir,fixturesPath,key){
 const fixture=JSON.parse(fs.readFileSync(fixturesPath))[key];if(!fixture)throw Error('Unknown fixture');const db=open(dir);db.configure('busyTimeout',5000);
 try{await run(db,'BEGIN IMMEDIATE');await run(db,'DELETE FROM products');await run(db,'DELETE FROM categories');await run(db,"DELETE FROM sqlite_sequence WHERE name IN ('products','categories')");
 for(const c of fixture.categories)await run(db,'INSERT INTO categories (id,name) VALUES (?,?)',[c.id,c.name]);
 for(const p of fixture.products)await run(db,'INSERT INTO products (id,name,price,description,imageUrl,category_id) VALUES (?,?,?,?,?,?)',[p.id,p.name,p.price,p.description,p.imageUrl,p.category_id]);
 await run(db,'UPDATE users SET login_attempts=0,locked_until=NULL');await run(db,'COMMIT');}catch(e){await run(db,'ROLLBACK').catch(()=>{});throw e;}finally{await close(db);}
}
async function snapshotProducts(dir){const db=open(dir);try{return await all(db,'SELECT id,name,price,description,imageUrl,category_id FROM products ORDER BY id');}finally{await close(db);}}
if(require.main===module){const args=process.argv.slice(2),get=(k,d)=>args.includes(k)?args[args.indexOf(k)+1]:d;
 if(args.includes('--self-check'))process.exit(require('node:child_process').spawnSync(process.execPath,['--test',path.join(__dirname,'harness.test.cjs')],{stdio:'inherit'}).status??1);
 (async()=>{const dir=get('--backend-dir');if(get('--reset'))await resetFixture(dir,get('--fixtures',path.join(__dirname,'fixtures.json')),get('--reset'));const snapshot=await snapshotProducts(dir);if(get('--snapshot'))fs.writeFileSync(get('--snapshot'),JSON.stringify(snapshot,null,2)+'\n');else console.log(JSON.stringify(snapshot));})().catch(e=>{console.error(e);process.exitCode=1;});
}
module.exports={resetFixture,snapshotProducts};
