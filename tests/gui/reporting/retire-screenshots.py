"""Verify a complete image/report migration before deleting the retired directory.
Default is a read-only check. --delete removes only the explicitly verified old directory.
"""
import pathlib,json,hashlib,zipfile,re,sys,shutil,datetime
ROOT=pathlib.Path(__file__).resolve().parents[3]
BASE=ROOT/'docs/gui-checklist/cross-platform/browser-evidence';OLD=ROOT/'docs/screenshots'

def verify():
    coverage=json.loads((BASE/'evidence-coverage.json').read_text())
    if not coverage['complete']:raise ValueError(f"Refuse removal: {len(coverage['missing'])} executed cells still lack accepted images")
    ledger=json.loads((BASE/'screenshot-migration.json').read_text());archive=ROOT/ledger['archive']
    if hashlib.sha256(archive.read_bytes()).hexdigest()!=ledger['archiveSha256']:raise ValueError('Archive hash mismatch')
    records={r['original_path']:r for r in ledger['files']}
    with zipfile.ZipFile(archive)as z:
        if z.testzip()is not None:raise ValueError('Archive CRC error')
        for name,r in records.items():
            if hashlib.sha256(z.read(name)).hexdigest()!=r['sha256']:raise ValueError('Archive content mismatch: '+name)
    if OLD.exists():
        if OLD.is_symlink()or not OLD.resolve().is_relative_to(ROOT.resolve())or OLD.name!='screenshots':raise ValueError('Unsafe removal root')
        if any(p.is_symlink()for p in OLD.rglob('*')):raise ValueError('Source directory acquired an unarchived symlink')
        current={str(p.relative_to(ROOT)):p for p in OLD.rglob('*')if p.is_file()}
        if set(current)!=set(records):raise ValueError('Source directory changed since backup; take a new verified backup')
        for name,p in current.items():
            if p.is_symlink()or hashlib.sha256(p.read_bytes()).hexdigest()!=records[name]['sha256']:raise ValueError('Unarchived source change: '+name)
    manifest=json.loads((BASE/'manifest.json').read_text())['images']
    keys={(r['platform'],r['itemId'])for r in manifest}
    if len(keys)!=len(manifest):raise ValueError('Duplicate canonical item/platform images')
    cells=json.loads((ROOT/'docs/gui-checklist/cross-platform/recovery-final/cells.json').read_text())
    required={(r['platformId'],r['itemId'])for r in cells if r['status']!='Not Run'}
    if not required.issubset(keys):raise ValueError('Current executed cells are not all covered by canonical images')
    for r in manifest:
        if r.get('visualReview','pending')=='pending' or not all(r.get('criteria',{}).get(k)for k in ['nativeBrowserChrome','addressBarURL','webInterface','readableStudentEmail']):raise ValueError('Unreviewed/noncompliant canonical frame')
        p=BASE/r['image']
        if not p.is_file()or hashlib.sha256(p.read_bytes()).hexdigest()!=r['sha256']:raise ValueError('Missing/corrupt canonical image '+str(p))
    for p in (ROOT/'docs/gui-checklist').rglob('*.md'):
        if 'history'in p.parts:continue
        for target in re.findall(r'\]\(([^)]+)\)',p.read_text()):
            target=target.split('#')[0]
            if target.startswith(('https:','http:','mailto:'))or not re.search(r'\.(?:png|jpe?g)$',target,re.I):continue
            image=pathlib.Path(target)if target.startswith('/')else p.parent/target
            if not image.is_file():raise ValueError('Broken report image link: '+str(p)+' -> '+target)
            if OLD in image.resolve().parents:raise ValueError('Active report still uses retired directory: '+str(p))
    active_keys={'image','path','sourceImage','evidence','evidenceLocalPaths','submission_evidence_path','nativePath'}
    def json_refs(value,key=''):
        if key.startswith('historical')or key in ['sourceArchive','archiveReference']:return
        if isinstance(value,dict):
            for k,v in value.items():yield from json_refs(v,k)
        elif isinstance(value,list):
            for v in value:yield from json_refs(v,key)
        elif isinstance(value,str)and key in active_keys and 'docs/screenshots'in value:yield value
    for p in (ROOT/'docs/gui-checklist').rglob('*.json'):
        if 'history'in p.parts:continue
        refs=list(json_refs(json.loads(p.read_text())))
        if refs:raise ValueError('Active structured report/capture still references retired directory: '+str(p))
    excluded={'retire-screenshots.py','link-browser-evidence.py'}
    for p in (ROOT/'tests/gui').rglob('*'):
        if not p.is_file()or p.suffix not in ['.ts','.mjs','.py']or p.name in excluded:continue
        if any(part in ['node_modules','test-results','artifacts','__pycache__']for part in p.parts):continue
        if 'docs/screenshots'in p.read_text():raise ValueError('Capture writer still references old directory: '+str(p))
    return ledger

if __name__=='__main__':
    try:ledger=verify()
    except (ValueError,OSError,KeyError)as e:print(str(e));sys.exit(2)
    print('Verified complete coverage, canonical images, report links, archive hashes and capture paths.')
    if '--delete'in sys.argv:
        if OLD.exists():shutil.rmtree(OLD)
        ledger['directoryRemoved']=True;ledger['removedAt']=datetime.datetime.now(datetime.timezone.utc).isoformat()
        (BASE/'screenshot-migration.json').write_text(json.dumps(ledger,indent=2))
        print('Removed only',OLD,'; recoverable archive:',ledger['archive'])
