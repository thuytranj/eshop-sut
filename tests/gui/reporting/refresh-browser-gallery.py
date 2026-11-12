"""Refresh delivery index/ZIP and coverage from accepted, hashed canonical frames."""
import pathlib,json,hashlib,zipfile,collections,datetime
ROOT=pathlib.Path(__file__).resolve().parents[3];BASE=ROOT/'docs/gui-checklist/cross-platform/browser-evidence'
doc=json.loads((BASE/'manifest.json').read_text());rows=sorted(doc['images'],key=lambda r:(r['platform'],r['itemId']))
keys={(r['platform'],r['itemId'])for r in rows}
cells=json.loads((ROOT/'docs/gui-checklist/cross-platform/recovery-final/cells.json').read_text())
missing=[{'platform':r['platformId'],'itemId':r['itemId'],'historicalStatus':r['status']}for r in cells if r['status']!='Not Run'and(r['platformId'],r['itemId'])not in keys]
for r in rows:
 p=BASE/r['image'];assert p.is_file();assert hashlib.sha256(p.read_bytes()).hexdigest()==r['sha256'];assert r.get('visualReview')!='pending'
counts=collections.Counter(r['platform']for r in rows)
coverage={'acceptedImages':len(rows),'requiredExecutedCells':sum(c['status']!='Not Run'for c in cells),'platformCounts':dict(counts),'missing':missing,'complete':not missing,'manualPending':[{'platform':r['platformId'],'itemId':r['itemId']}for r in cells if r['status']=='Not Run'],'updatedAt':datetime.datetime.now(datetime.timezone.utc).isoformat()}
(BASE/'evidence-coverage.json').write_text(json.dumps(coverage,ensure_ascii=False,indent=2))
labels={'p1-chrome-win11':'Chrome / Windows 11','p2-firefox-win11':'Firefox / Windows 11','p3-android-chrome':'Chrome / Android / Galaxy S23 thật'}
lines=['# Ảnh bằng chứng cross-platform','','Ảnh được lấy từ cửa sổ trình duyệt thật trong video BrowserStack hoặc chụp trực tiếp màn hình thiết bị Android thật. Email sinh viên được hiển thị trên trang lúc chụp; không ghép thanh trình duyệt hoặc thêm watermark sau khi chụp.','','Mỗi ảnh đã được rà trực tiếp: thanh trình duyệt + địa chỉ URL + màn hình web tương ứng + email `23120367@student.hcmus.edu.vn`. Trên Android, Chrome có thể rút gọn địa chỉ trong thanh native; watermark ghi URL đầy đủ.','','## Độ phủ hiện tại','',f"**{len(rows)} ảnh đã duyệt / {coverage['requiredExecutedCells']} ô có kết quả cần ảnh; còn {len(missing)} ô thiếu ảnh.**",'',*['- '+labels[p]+': '+str(counts[p])+' ảnh'for p in labels],'','Các ô Not Run chờ IME/screen-reader không được đổi thành Passed/Failed bằng việc chụp ảnh. Kết quả cũ trong báo cáo lịch sử được giữ nguyên; ảnh bổ sung có ngày, phiên và môi trường riêng trong manifest. Ảnh Windows/Android không được coi là ảnh macOS gốc của báo cáo cũ.','','- [Tải bộ ảnh đã duyệt ZIP](EShop-Cross-Platform-Screenshots.zip)','- [Độ phủ và danh sách cần bổ sung](evidence-coverage.json)','- [Nguồn phiên, hash và xác nhận rà ảnh](manifest.json)','- [Bản sao lưu thư mục ảnh cũ](screenshot-migration.json)','','## Danh sách ảnh','','| Nền tảng | Checklist | Ảnh | Phiên BrowserStack |','|---|---|---|---|']
for r in rows:lines.append(f"| {labels[r['platform']]} | {r['itemId']} | [Xem ảnh]({r['image']}) | [Phiên thật]({r['dashboardURL']}) |")
if missing:
 lines+=['','## Các ô chưa có ảnh đạt chuẩn','',*['- '+r['platform']+' / '+r['itemId']for r in missing]]
(BASE/'README.md').write_text('\n'.join(lines)+'\n')
with zipfile.ZipFile(BASE/'EShop-Cross-Platform-Screenshots.zip','w',zipfile.ZIP_DEFLATED)as z:
 for name in ['README.md','manifest.json','evidence-coverage.json','replacements.csv','screenshot-migration.json','report-link-migration.json']:
  p=BASE/name
  if p.exists():z.write(p,name)
 for r in rows:z.write(BASE/r['image'],r['image'])
print('Accepted',len(rows),'missing',len(missing),'counts',dict(counts))
