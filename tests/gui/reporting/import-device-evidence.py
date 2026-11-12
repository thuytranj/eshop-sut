"""Stage whole-device captures for direct visual review (never auto-approve)."""
import pathlib,json,hashlib,sys,datetime
ROOT=pathlib.Path(__file__).resolve().parents[3]
BASE=ROOT/'docs/gui-checklist/cross-platform/browser-evidence'
run=sys.argv[1]
source=BASE/'captures/p3-android-chrome'/run
out=BASE/'captures/browser-window'/run;out.mkdir(parents=True,exist_ok=True)
manifest=out/'manifest.json'
previous={r['itemId']:r for r in json.loads(manifest.read_text())}if manifest.exists()else {}
rows=[]
for marker_path in sorted(source.glob('*-recording-marker.json')):
 marker=json.loads(marker_path.read_text());item=marker['context']['itemId'];image=source/(item+'-native.png')
 if not image.exists():continue
 rows.append({'itemId':item,'platform':'p3-android-chrome','runId':run,'sessionId':marker['sessionId'],'dashboardURL':'https://automate.browserstack.com/dashboard/v2/sessions/'+marker['sessionId'],'source':'Unmodified screenshot of the verified real Android device via AndroidDevice.screenshot, while student watermark is rendered on page.','captureRequestedAfter':marker['visibleUntil'],'nativeCapturedAt':marker.get('nativeCapturedAt'),'actualURL':marker['actualURL'],'identity':marker['context']['identity'],'image':str(image.relative_to(ROOT)),'sha256':hashlib.sha256(image.read_bytes()).hexdigest(),'visualReview':'pending','selectionMethod':'Whole-device native screenshot; no cropping, toolbar compositing or post-capture watermark.'})
for index,row in enumerate(rows):
 prior=previous.get(row['itemId'])
 if prior and prior.get('sha256')==row['sha256']and prior.get('sessionId')==row['sessionId']:
  rows[index]={**row,**prior}
current_ids={r['itemId']for r in rows}
rows.extend(r for item,r in previous.items()if item not in current_ids and r.get('visualReview','').startswith('rejected')and (ROOT/r['image']).is_file())
manifest.write_text(json.dumps(rows,ensure_ascii=False,indent=2))
print('Staged',len(rows),'native frames for visual inspection in',out)
