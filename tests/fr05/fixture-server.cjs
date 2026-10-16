// Loopback fixture controller and transparent response timing/error proxy.
const fs = require('node:fs'), path = require('node:path'), http = require('node:http');
const root = path.resolve(__dirname, '../..');
const runId = process.argv[2];
if (!/^[a-z0-9][a-z0-9-]{0,70}$/.test(runId || '')) throw Error('invalid run-id');
const dir = `/private/tmp/eshop-fr05-${runId}`;
const sqlite = require(path.join(root, 'backend/node_modules/sqlite3'));
const catalog = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/catalog.json')));
const db = new sqlite.Database(path.join(dir, 'backend/database.sqlite'), sqlite.OPEN_READWRITE);
const evidence = path.join(root, 'docs/testing/fr05/evidence', runId);
fs.mkdirSync(path.join(evidence, 'api'), { recursive: true });
let config = { fixtureId: 'full', mode: 'normal', delayMs: 8000 };
const log = (event) => fs.appendFileSync(path.join(evidence, 'requests.jsonl'), JSON.stringify({ at: new Date().toISOString(), ...event }) + '\n');
function reset(rows) {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('BEGIN TRANSACTION');
      db.run('DELETE FROM products');
      const st = db.prepare('INSERT INTO products (id,name,price,description,imageUrl,category_id) VALUES (?,?,?,?,?,?)');
      let error;
      for (const p of rows) st.run([p.id,p.name,p.price,p.description,p.imageUrl,p.category_id], e => { if(e) error=e; });
      st.finalize();
      db.run('COMMIT', e => e || error ? reject(e || error) : resolve());
    });
  });
}
http.createServer(async (req, res) => {
  if (req.url === '/__control' && req.method === 'POST') {
    let body = '';
    for await (const part of req) { body += part; if(body.length > 8192) {res.writeHead(413).end();return;} }
    try {
      const c = JSON.parse(body);
      if (!catalog.snapshots[c.fixtureId] || !['normal','delay','error','race'].includes(c.mode || 'normal')) throw Error('unknown fixture or mode');
      await reset(catalog.snapshots[c.fixtureId]);
      config = { fixtureId:c.fixtureId, mode:c.mode || 'normal', delayMs:Math.max(0,Math.min(30000,c.delayMs || 8000)) };
      const ids = await new Promise((resolve,reject) => db.all('SELECT id FROM products ORDER BY id', (e,r) => e ? reject(e) : resolve(r.map(x=>x.id))));
      log({ control: config, ids });
      res.setHeader('Content-Type','application/json');res.end(JSON.stringify({...config,ids}));
    } catch(e) {res.writeHead(400).end(JSON.stringify({error:e.message}));}
    return;
  }
  const current = {...config}, requested = Date.now();
  log({ request: req.url, config: current });
  if (current.mode === 'error') { req.socket.destroy(); return; }
  const upstream = http.get({host:'127.0.0.1',port:3000,path:req.url}, response => {
    const chunks=[];response.on('data',b=>chunks.push(b));response.on('end',()=>{
      const body=Buffer.concat(chunks);
      const q=new URL(req.url,'http://localhost').searchParams.get('search');
      const wait=current.mode==='delay'?current.delayMs:(current.mode==='race' && q==='Alpha'?20000:0);
      setTimeout(()=>{res.writeHead(response.statusCode,response.headers);res.end(body);log({response:req.url,status:response.statusCode,elapsedMs:Date.now()-requested,body:body.toString()});},wait);
    });
  });
  upstream.on('error',e=>{log({upstreamError:e.message});res.writeHead(502).end(e.message);});
}).listen(3002,'127.0.0.1',()=>console.log('FR05 fixture proxy ready on 127.0.0.1:3002'));
