"""Import explicitly visually reviewed source rows into the canonical image set."""
import pathlib,json,sys,hashlib,datetime,shutil
ROOT=pathlib.Path(__file__).resolve().parents[3];BASE=ROOT/'docs/gui-checklist/cross-platform/browser-evidence'
run=sys.argv[1];ids=set(sys.argv[2:]);assert ids,'Specify reviewed item IDs'
p=BASE/'captures/browser-window'/run/'manifest.json';rows=json.loads(p.read_text())
canonical=BASE/'manifest.json';doc=json.loads(canonical.read_text());bykey={(r['platform'],r['itemId']):r for r in doc['images']};now=datetime.datetime.now(datetime.timezone.utc).isoformat()
found=set()
for r in rows:
 if r['itemId']not in ids:continue
 assert not r.get('visualReview','').startswith('rejected'),'Recapture rejected frames before accepting them'
 source=ROOT/r['image'];assert source.is_file();assert hashlib.sha256(source.read_bytes()).hexdigest()==r['sha256']
 r['visualReview']='confirmed: native browser toolbar/address URL, intended web screen and readable student email'
 r['visualReviewedAt']=now;r['visualReviewBy']='AI-assisted direct visual inspection';r['criteria']={'nativeBrowserChrome':True,'addressBarURL':True,'webInterface':True,'readableStudentEmail':True}
 target=BASE/'images'/r['platform']/(r['itemId']+'.png');target.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(source,target)
 attemptsPath=ROOT/'artifacts/gui/cross-platform'/run/'attempts.json'
 if attemptsPath.exists():
  attempt=next((a for a in json.loads(attemptsPath.read_text()) if a['itemId']==r['itemId'] and a['environment'].get('sessionId')==r['sessionId']),None)
  if attempt:r['captureExecution']={k:attempt.get(k)for k in ['caseId','outcome','failureKind','actual','startedAt','endedAt']}
 new={**r,'sourceImage':r['image'],'image':str(target.relative_to(BASE))}
 bykey[(r['platform'],r['itemId'])]=new;found.add(r['itemId'])
assert found==ids,('Missing source items',ids-found)
p.write_text(json.dumps(rows,ensure_ascii=False,indent=2));doc['images']=[v for k,v in sorted(bykey.items())];doc['generatedAt']=now
canonical.write_text(json.dumps(doc,ensure_ascii=False,indent=2));print('Accepted',len(found),'reviewed images; canonical total',len(bykey))
