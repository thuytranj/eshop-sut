"""Mutation tests: a validator that ignores a named corruption must fail."""
import copy, json, pathlib, subprocess, sys, tempfile, unittest
ROOT=pathlib.Path(__file__).resolve().parents[2]
SUITE=json.loads((ROOT/'tests/fr05/suite.json').read_text())
class ValidatorTests(unittest.TestCase):
    def cli(self,suite,obs=None):
        with tempfile.TemporaryDirectory() as tmp:
            p=pathlib.Path(tmp)/'suite.json';p.write_text(json.dumps(suite))
            cmd=[sys.executable,str(ROOT/'tests/fr05/validate_suite.py'),'--suite',str(p)]
            if obs is not None:
                q=pathlib.Path(tmp)/'observations.json';q.write_text(json.dumps(obs));cmd+=['--observations',str(q)]
            return subprocess.run(cmd,capture_output=True,text=True,cwd=ROOT)
    def test_valid_suite_is_accepted(self):
        p=self.cli(SUITE);self.assertEqual(p.returncode,0,p.stderr+p.stdout)
    def test_duplicate_case_id_rejected(self):
        x=copy.deepcopy(SUITE);x['cases'][1]['id']=x['cases'][0]['id'];p=self.cli(x);self.assertEqual(p.returncode,1,p.stderr);self.assertIn('duplicate',p.stdout)
    def test_lost_bva_mapping_rejected(self):
        x=copy.deepcopy(SUITE);c=next(c for c in x['cases'] if 'FR05-BVA-N2' in c['obligationIds']);c['obligationIds'].remove('FR05-BVA-N2');p=self.cli(x);self.assertEqual(p.returncode,1,p.stderr);self.assertIn('FR05-BVA-N2',p.stdout)
    def test_source_orphan_rejected(self):
        x=copy.deepcopy(SUITE);x['cases'][0]['sourceCaseIds']=[];p=self.cli(x);self.assertEqual(p.returncode,1);self.assertIn('source',p.stdout)
    def test_wrong_technique_rejected(self):
        x=copy.deepcopy(SUITE);next(c for c in x['cases'] if 'BVA' in c['techniques'])['techniques']=['DT'];p=self.cli(x);self.assertEqual(p.returncode,1);self.assertIn('technique',p.stdout)
    def rows(self):
        return [{'runId':'unit','caseId':c['id'],'interface':c['interface'],'platform':c['platform'],'actual':'Chưa kiểm vì unit fixture','assertions':[],'status':'Blocked','evidence':['docs/testing/fr05/requirements.md'],'bugIds':[],'reason':'UNIT_FIXTURE'} for c in SUITE['cases']]
    def test_blocked_full_reconciliation_accepted(self):
        p=self.cli(SUITE,self.rows());self.assertEqual(p.returncode,0,p.stdout+p.stderr)
    def test_missing_observation_rejected(self):
        p=self.cli(SUITE,self.rows()[1:]);self.assertEqual(p.returncode,1);self.assertIn('missing',p.stdout)
    def test_duplicate_observation_rejected(self):
        x=self.rows();x.append(x[0]);p=self.cli(SUITE,x);self.assertEqual(p.returncode,1);self.assertIn('duplicate',p.stdout)
    def test_unknown_case_rejected(self):
        x=self.rows();x[0]['caseId']='unknown';p=self.cli(SUITE,x);self.assertEqual(p.returncode,1);self.assertIn('unknown',p.stdout)
    def test_verdict_requires_actual_and_assertions(self):
        x=self.rows();x[0].update(status='Passed',actual=None);p=self.cli(SUITE,x);self.assertEqual(p.returncode,1);self.assertIn('actual',p.stdout)
    def test_missing_evidence_rejected(self):
        x=self.rows();x[0]['evidence']=['docs/testing/fr05/no-such-evidence.png'];p=self.cli(SUITE,x);self.assertEqual(p.returncode,1);self.assertIn('evidence',p.stdout)
    def test_source_scenario_mismatch_rejected(self):
        x=copy.deepcopy(SUITE);x['cases'][1]['input']['search']='unrelated';p=self.cli(x);self.assertEqual(p.returncode,1);self.assertIn('scenario',p.stdout)
if __name__=='__main__':unittest.main()
