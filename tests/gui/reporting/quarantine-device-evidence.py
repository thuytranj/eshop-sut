"""Preserve rejected native frames outside the list of usable capture candidates."""
import pathlib,json,sys
ROOT=pathlib.Path(__file__).resolve().parents[3];BASE=ROOT/'docs/gui-checklist/cross-platform/browser-evidence'
run,reason,*ids=sys.argv[1:];source=BASE/'captures/p3-android-chrome'/run
manifest=BASE/'captures/browser-window'/run/'manifest.json';rows=json.loads(manifest.read_text());found=set()
for row in rows:
 if row['itemId']not in ids:continue
 assert row.get('visualReview','pending')=='pending'or row.get('visualReview','').startswith('rejected'), 'Refuse to quarantine an accepted review'
 old=ROOT/row['image'];target=source/'rejected'/old.name;target.parent.mkdir(exist_ok=True)
 if old!=target:
  assert not target.exists();old.rename(target)
 row['image']=str(target.relative_to(ROOT));row['visualReview']='rejected: '+reason
 marker_path=source/(row['itemId']+'-recording-marker.json');marker=json.loads(marker_path.read_text());marker['nativePath']=str(target);marker['visualRejection']=reason;marker_path.write_text(json.dumps(marker,ensure_ascii=False,indent=2));found.add(row['itemId'])
assert found==set(ids),('Missing staged IDs',set(ids)-found)
manifest.write_text(json.dumps(rows,ensure_ascii=False,indent=2));print('Preserved rejected native frames:',sorted(found))
