const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),crypto=require('node:crypto');
const repoRoot=path.resolve(__dirname,'../..');
const hash=f=>fs.existsSync(f)?crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex'):null;
function workingHashes(){return Object.fromEntries(['','-wal','-shm','-journal'].map(s=>{const f=path.join(repoRoot,'backend/database.sqlite'+s);return [f,hash(f)];}));}
function prepareEnvironment(root){
 root=path.resolve(root);if(fs.existsSync(root))throw Error('Refuse existing root');
 const parent=fs.realpathSync(path.dirname(root));const temporary=[fs.realpathSync(os.tmpdir()),'/private/tmp'];
 if(!temporary.some(t=>parent===t||parent.startsWith(t+path.sep)))throw Error('Root must be inside temporary directory');
 const before=workingHashes();fs.mkdirSync(root,{recursive:false});const backendDir=path.join(root,'backend');fs.mkdirSync(backendDir);
 const hashes={};for(const f of ['server.js','database.js','package.json','package-lock.json']){fs.copyFileSync(path.join(repoRoot,'backend',f),path.join(backendDir,f));hashes[f]=hash(path.join(backendDir,f));}
 const deps=path.join(repoRoot,'backend/node_modules');if(!fs.existsSync(deps))throw Error('Run npm ci in backend first');fs.symlinkSync(deps,path.join(backendDir,'node_modules'),'dir');
 const metadata={root:fs.realpathSync(root),backendDir:fs.realpathSync(backendDir),workingBackend:fs.realpathSync(path.join(repoRoot,'backend')),workingHashes:before,sourceHashes:hashes};
 fs.writeFileSync(path.join(root,'.fr15-owner.json'),JSON.stringify(metadata,null,2)+'\n');return metadata;
}
function safeBackend(dir){
 const real=fs.realpathSync(dir),working=fs.realpathSync(path.join(repoRoot,'backend'));
 if(real===working||real.startsWith(working+path.sep))throw Error('Refuse working backend');
 const marker=JSON.parse(fs.readFileSync(path.join(real,'../.fr15-owner.json')));
 if(marker.backendDir!==real||marker.workingBackend!==working)throw Error('Ownership mismatch');
 const db=path.join(real,'database.sqlite');if(fs.existsSync(db)){const s=fs.lstatSync(db);if(s.isSymbolicLink()||s.nlink!==1)throw Error('Refuse linked DB');}return real;
}
if(require.main===module){const args=process.argv.slice(2);if(args.includes('--self-check')){process.exit(require('node:child_process').spawnSync(process.execPath,['--test',path.join(__dirname,'harness.test.cjs')],{stdio:'inherit'}).status??1);}console.log(JSON.stringify(prepareEnvironment(args[args.indexOf('--root')+1]),null,2));}
module.exports={prepareEnvironment,safeBackend,workingHashes,hash,repoRoot};
