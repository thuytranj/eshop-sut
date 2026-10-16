"""Live self-check of fixture controller/proxy; not a SUT pass/fail oracle."""
import json,os,urllib.request,unittest
BASE='http://127.0.0.1:3002'
@unittest.skipUnless(os.environ.get('FR05_LIVE') == '1', 'Live fixture checks require FR05_LIVE=1 and proxy3002')
class ProtocolTests(unittest.TestCase):
    def control(self,fixture):
        req=urllib.request.Request(BASE+'/__control',data=json.dumps({'fixtureId':fixture,'mode':'normal'}).encode(),headers={'Content-Type':'application/json'})
        return json.load(urllib.request.urlopen(req,timeout=5))
    def test_snapshot_reset_is_visible_through_proxy(self):
        self.assertEqual(self.control('two')['ids'],[201,202])
        rows=json.load(urllib.request.urlopen(BASE+'/api/products?search=Alpha',timeout=5));self.assertEqual([r['id'] for r in rows],[201,202])
        self.assertEqual(self.control('one')['ids'],[201])
        rows=json.load(urllib.request.urlopen(BASE+'/api/products?search=Alpha',timeout=5));self.assertEqual([r['id'] for r in rows],[201])
    def test_empty_snapshot_really_clears_previous_rows(self):
        self.control('two');self.assertEqual(self.control('empty')['ids'],[])
        self.assertEqual(json.load(urllib.request.urlopen(BASE+'/api/products?search=Alpha',timeout=5)),[])
if __name__=='__main__':unittest.main()
