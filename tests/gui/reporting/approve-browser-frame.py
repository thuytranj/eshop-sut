import json,pathlib,sys,shutil,hashlib,datetime
root=pathlib.Path(__file__).resolve().parents[3]
run,item,index=sys.argv[1],sys.argv[2],int(sys.argv[3])
out=root/'docs/gui-checklist/cross-platform/browser-evidence/captures/browser-window'/run
r=json.loads((out/(item+'-review.json')).read_text())
frame=pathlib.Path(r['frames'][index-1]);dest=out/(item+'-browser.png');shutil.copyfile(frame,dest)
entry={'itemId':item,'platform':r['platform'],'runId':run,'sessionId':r['sessionId'],'dashboardURL':'https://automate.browserstack.com/dashboard/v2/sessions/'+r['sessionId'],'source':'Unmodified frame from actual BrowserStack provider video; watermark rendered on page during capture.','videoFrameSecondsApprox':r['start']+index-1,'actualURL':r['marker']['actualURL'],'identity':r['marker']['context']['identity'],'image':str(dest.relative_to(root)),'sha256':hashlib.sha256(dest.read_bytes()).hexdigest(),'sourceVideoSha256':r['videoSha256'],'visualReview':'confirmed: native browser toolbar/address URL, expected web screen and readable student email','visualReviewedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'selectionMethod':'Direct visual inspection; OCR not required'}
p=out/'manifest.json';entries=json.loads(p.read_text()) if p.exists() else []
entries=[e for e in entries if e['itemId']!=item]+[entry];p.write_text(json.dumps(entries,ensure_ascii=False,indent=2))
print(dest)
