const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
test('fixture PNG has valid chunk CRCs to avoid unrelated image fallback',()=>{
 const data=JSON.parse(fs.readFileSync(path.join(__dirname,'fixtures.json'))).baseline.products[0].imageUrl;
 const {spawnSync}=require('node:child_process');
 const r=spawnSync('python3',['-c',"import sys,base64,struct,zlib; b=base64.b64decode(sys.argv[1].split(',')[1]); p=8\nwhile p<len(b):\n n=struct.unpack('>I',b[p:p+4])[0]; assert struct.unpack('>I',b[p+8+n:p+12+n])[0]==zlib.crc32(b[p+4:p+8+n]),'PNG chunk CRC mismatch'; p+=n+12",data],{encoding:'utf8'});
 assert.equal(r.status,0,r.stderr);
});
