"""Guard isolation: these tests never start the application backend."""
import hashlib,json,pathlib,subprocess,tempfile,unittest,uuid
ROOT=pathlib.Path(__file__).resolve().parents[2]
class EnvironmentTests(unittest.TestCase):
    def test_prepare_copies_sut_without_mutating_working_data(self):
        before={p:hashlib.sha256((ROOT/p).read_bytes()).hexdigest() for p in ['backend/database.sqlite','backend/server.js','backend/database.js','frontend-mobile/App.js']}
        rid='selfcheck-'+uuid.uuid4().hex[:8]
        p=subprocess.run(['node','tests/fr05/prepare-environment.cjs','--suite','tests/fr05/suite.json','--run-id',rid],cwd=ROOT,text=True,capture_output=True)
        self.assertEqual(p.returncode,0,p.stderr)
        env=json.loads(p.stdout);base=pathlib.Path(env['root'])
        self.assertEqual((base/'backend/server.js').read_bytes(),(ROOT/'backend/server.js').read_bytes())
        self.assertEqual((base/'backend/database.js').read_bytes(),(ROOT/'backend/database.js').read_bytes())
        self.assertFalse((base/'backend/database.sqlite').exists())
        source=(ROOT/'frontend-mobile/App.js').read_text();copy=(base/'mobile/App.js').read_text()
        self.assertEqual(copy,source.replace('http://192.168.10.13:3000/api','http://127.0.0.1:3002/api'))
        self.assertEqual(before,{p:hashlib.sha256((ROOT/p).read_bytes()).hexdigest() for p in before})
    def test_run_id_cannot_escape_tmp(self):
        p=subprocess.run(['node','tests/fr05/prepare-environment.cjs','--suite','tests/fr05/suite.json','--run-id','../escape'],cwd=ROOT,text=True,capture_output=True)
        self.assertEqual(p.returncode,1,p.stderr);self.assertIn('invalid run-id',p.stderr)
if __name__=='__main__':unittest.main()
