"""Build report-facing supplemental screenshot links without rewriting past outcomes."""
import pathlib,json,re,os,hashlib,csv
ROOT=pathlib.Path(__file__).resolve().parents[3]
BASE=ROOT/'docs/gui-checklist/cross-platform/browser-evidence'
CELLS=json.loads((ROOT/'docs/gui-checklist/cross-platform/recovery-final/cells.json').read_text())
STATUSES={(r['platformId'],r['itemId']):r['status'] for r in CELLS}
HEADING='## Ảnh bằng chứng chuẩn (phiên chụp bổ sung)'

def load_images():
    images=json.loads((BASE/'manifest.json').read_text())['images']
    for row in images:
        image=BASE/row['image']
        if not image.is_file() or hashlib.sha256(image.read_bytes()).hexdigest()!=row['sha256']:
            raise ValueError('Invalid canonical image: '+str(image))
    return {(r['platform'],r['itemId']):r for r in images}

def section(file,ids,images):
    lines=[HEADING,'','Ảnh dưới đây thuộc phiên chụp bổ sung được ghi rõ trong manifest, không thay đổi môi trường, thời gian hoặc kết quả của lượt chạy lịch sử ở trên. Với báo cáo macOS cũ, ảnh Windows/Android là bằng chứng tái hiện riêng, không phải ảnh macOS gốc.','','| Checklist | Nền tảng chụp | Ảnh chuẩn | Kết quả ca tự động của phiên chụp | Phiên thật |','|---|---|---|---|---|']
    gallery=os.path.relpath(BASE/'README.md',file.parent)
    lines[4:4]=[f'[Toàn bộ ảnh đã duyệt và độ phủ trên ba nền tảng]({gallery}). Bảng dưới liệt kê các checklist ID được nhắc trong báo cáo này.','']
    for item in ids:
        for platform in ['p1-chrome-win11','p2-firefox-win11','p3-android-chrome']:
            r=images.get((platform,item))
            if r:
                image=BASE/r['image'];link=os.path.relpath(image,file.parent)
                lines.append(f"| {item} | {platform} | [Xem ảnh]({link}) | {r.get('captureExecution',{}).get('outcome','Xem manifest')} | [BrowserStack]({r['dashboardURL']}) |")
            else:
                reason='Not Run — chờ kiểm tra thủ công' if STATUSES.get((platform,item))=='Not Run' else 'Chưa có ảnh đạt chuẩn — đang bổ sung'
                lines.append(f'| {item} | {platform} | {reason} | — | — |')
    return '\n'.join(lines)+'\n'

def migrate():
    images=load_images();changes=[];retired=[]
    scopes=[ROOT/'docs/gui-checklist/automation',ROOT/'docs/gui-checklist/cross-platform']
    for scope in scopes:
        for p in sorted(scope.rglob('*.md')):
            if BASE in p.parents:continue
            original=p.read_text();text=original.split(HEADING)[0].rstrip()
            ids=sorted(set(re.findall(r'GUI-\d{3}',text)))
            if not ids:continue
            # Retire stale report image links; preserve their exact text in the migration ledger.
            new=[]
            for line in text.splitlines():
                if re.search(r'(?:test-results|docs/screenshots|screenshots/).*\.(?:png|jpe?g)',line):
                    retired.append({'report':str(p.relative_to(ROOT)),'retiredLine':line})
                    new.append('Ảnh cũ đã được thay bằng các liên kết chuẩn trong mục bằng chứng bổ sung bên dưới.')
                else:new.append(line)
            text='\n'.join(new)+'\n\n'+section(p,ids,images)
            if text!=original:p.write_text(text);changes.append(str(p.relative_to(ROOT)))
    # The JSON issue payload mirrors its Markdown draft; historical paths remain inert provenance.
    issues=ROOT/'docs/gui-checklist/automation/issue-drafts/issues.json'
    if issues.exists():
        rows=json.loads(issues.read_text())
        for issue in rows:
            item=next(iter(re.findall(r'GUI-\d{3}',issue.get('key',''))),None)
            if not item:continue
            draft=issues.parent/(issue['key']+'.md')
            if draft.exists():issue['body']=draft.read_text()
            old=issue.get('evidenceLocalPaths',[])
            if 'historicalEvidenceLocalPaths'not in issue:issue['historicalEvidenceLocalPaths']=old
            matches=[r for (platform,i),r in images.items()if i==item]
            issue['evidenceLocalPaths']=[str((BASE/r['image']).relative_to(ROOT))for r in matches]
            issue['evidenceCaptureProvenance']=[{'platform':r['platform'],'runId':r['runId'],'sessionId':r['sessionId'],'role':'supplemental recapture; not original execution evidence'}for r in matches]
        issues.write_text(json.dumps(rows,ensure_ascii=False,indent=2))
    # Report views may point at new evidence, while original raw attempts are archived separately.
    for name in ['cells.json','attempts.json']:
        p=ROOT/'docs/gui-checklist/cross-platform/recovery-final'/name
        if not p.exists():continue
        history=BASE/'history'/('recovery-final-'+name);history.parent.mkdir(parents=True,exist_ok=True)
        if not history.exists():history.write_bytes(p.read_bytes())
        rows=json.loads(p.read_text())
        def update_attempt(a,platform,item):
            r=images.get((platform,item))
            old=a.get('evidence',[])
            if 'historicalEvidence'not in a:a['historicalEvidence']=old
            a['evidence']=[str((BASE/r['image']).relative_to(ROOT))]if r else []
            if r:a['evidenceCapture']={'runId':r['runId'],'sessionId':r['sessionId'],'platform':r['platform'],'supplemental':True}
        for row in rows:
            if name=='cells.json':
                key=(row['platformId'],row['itemId']);r=images.get(key)
                for a in row.get('attempts',[]):update_attempt(a,*key)
                if r:row['supplementalBrowserEvidence']={'image':str((BASE/r['image']).relative_to(ROOT)),'runId':r['runId'],'sessionId':r['sessionId'],'changesOriginalOutcome':False}
            else:update_attempt(row,row['targetId'],row['itemId'])
        p.write_text(json.dumps(rows,ensure_ascii=False,indent=2))
    ledger=BASE/'report-link-migration.json'
    prior=json.loads(ledger.read_text())if ledger.exists()else {}
    changes=sorted(set(changes+prior.get('reportsUpdated',[])))
    retired=list({json.dumps(r,sort_keys=True):r for r in retired+prior.get('retiredImageReferences',[])}.values())
    ledger.write_text(json.dumps({'reportsUpdated':changes,'retiredImageReferences':retired,'note':'Retired lines are inert provenance. Original outcomes and report snapshots are preserved; pre-existing missing test-results images are not reconstructed.'},ensure_ascii=False,indent=2))
    print('Updated reports:',len(changes))

if __name__=='__main__':migrate()
