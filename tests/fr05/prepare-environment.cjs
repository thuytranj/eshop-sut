// Only creates a new disposable copy; never imports database.js or starts a server.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '../..');
const argv = process.argv.slice(2);
const get = (name) => argv[argv.indexOf(name) + 1];
try {
  const runId = argv.includes('--run-id') && get('--run-id');
  if (!runId || !/^[a-z0-9][a-z0-9-]{0,70}$/.test(runId)) throw Error('invalid run-id');
  const suite = JSON.parse(fs.readFileSync(path.resolve(root, get('--suite')), 'utf8'));
  if (suite.version !== 'fr05-v1') throw Error('unsupported suite version');
  const dir = `/private/tmp/eshop-fr05-${runId}`;
  fs.mkdirSync(dir); // Refuse an existing run directory rather than overwriting evidence.
  for (const [component, target] of [['backend', 'backend'], ['frontend-mobile', 'mobile']]) {
    const dest = path.join(dir, target);
    fs.mkdirSync(dest);
    for (const entry of fs.readdirSync(path.join(root, component))) {
      if (['node_modules', '.expo', 'database.sqlite', 'database.sqlite-shm', 'database.sqlite-wal'].includes(entry)) continue;
      fs.cpSync(path.join(root, component, entry), path.join(dest, entry), { recursive: true });
    }
    fs.symlinkSync(path.join(root, component, 'node_modules'), path.join(dest, 'node_modules'), 'dir');
  }
  const mobile = path.join(dir, 'mobile/App.js');
  const before = fs.readFileSync(mobile, 'utf8');
  const from = 'http://192.168.10.13:3000/api', to = 'http://127.0.0.1:3002/api';
  if (before.split(from).length !== 2) throw Error('expected exactly one API endpoint');
  fs.writeFileSync(mobile, before.replace(from, to));
  fs.writeFileSync(path.join(dir, 'adjustment.json'), JSON.stringify({ file: 'mobile/App.js', from, to, reason: 'iOS simulator loopback to controlled proxy; no business behavior changed' }, null, 2));
  process.stdout.write(JSON.stringify({ runId, root: dir, backend: path.join(dir, 'backend'), mobile: path.join(dir, 'mobile') }) + '\n');
} catch (e) { console.error(e.message); process.exitCode = 1; }
