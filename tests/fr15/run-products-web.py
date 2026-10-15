"""FR15 Admin UI runner. Fixture and verdict helpers never mutate the SUT code."""
import argparse
import json
import subprocess
import time
import urllib.request
from pathlib import Path
from datetime import datetime
from zoneinfo import ZoneInfo
from playwright.sync_api import sync_playwright

HERE = Path(__file__).resolve().parent
REPO = HERE.parent.parent

def stamp():
    return datetime.now(ZoneInfo('Asia/Ho_Chi_Minh')).isoformat(timespec='seconds')

def fixture(args, key=None):
    command = ['node', str(HERE / 'fixture-store.cjs'), '--backend-dir', args.backend_dir]
    if key is not None:
        command += ['--reset', key, '--fixtures', str(HERE / 'fixtures.json')]
    return json.loads(subprocess.check_output(command, text=True))

def rows(page):
    return page.locator('table tbody tr').evaluate_all("""rs => rs.map(r => {
        const cells=r.querySelectorAll('td');
        return {name:cells[1].textContent,price:Number(cells[2].textContent.replace(/[^0-9.\\-]/g,'')),alt:cells[0].querySelector('img').alt};
    })""")

def settle(page, pending):
    """Require 500ms without outstanding API requests, pumping browser events."""
    deadline = time.monotonic() + 15
    quiet = None
    while time.monotonic() < deadline:
        page.wait_for_timeout(50)
        if pending:
            quiet = None
        elif quiet is None:
            quiet = time.monotonic()
        elif time.monotonic() - quiet >= 0.5:
            page.evaluate('() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))')
            return
    raise TimeoutError('API requests did not settle')


def main():
    parser = argparse.ArgumentParser()
    for key in ['suite', 'backend-dir', 'base-url', 'api-url', 'out', 'run-id']:
        parser.add_argument('--'+key, required=True)
    args = parser.parse_args()
    suite = [c for c in json.loads(Path(args.suite).read_text()) if c['layer'] == 'WEB']
    out = Path(args.out)
    (out / 'screenshots').mkdir(exist_ok=True)
    observations = []
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        (out / 'browser.json').write_text(json.dumps({'engine':'Chromium','version':browser.version,'viewport':{'width':1440,'height':1000},'locale':'vi-VN','timezone':'Asia/Ho_Chi_Minh'},indent=2)+'\n')
        try:
            for c in suite:
                o = dict(caseId=c['id'], runId=args.run_id, attempted=True, startedAt=stamp(), inputIntended=c['input'], inputEffective=None, request=None, response=None, stateBefore=None, stateAfter=None, uiBeforeReload=None, uiAfterReload=None, actual=None, status='Not Run', blockReason=None, evidence=[], exercisedObligations=[], console=[], dialogs=[])
                context = None
                detail = out / (c['id']+'.json')
                try:
                    o['stateBefore'] = fixture(args, c['fixtureKey'])
                    context = browser.new_context(viewport={'width':1440,'height':1000},locale='vi-VN',timezone_id='Asia/Ho_Chi_Minh')
                    page = context.new_page()
                    page.set_default_timeout(10000)
                    page.on('console',lambda msg:o['console'].append({'type':msg.type,'text':msg.text}))
                    page.on('pageerror',lambda error:o['console'].append({'type':'pageerror','text':str(error)}))
                    def dialog(d):
                        o['dialogs'].append({'type':d.type,'message':d.message})
                        d.accept()
                    page.on('dialog',dialog)
                    mutations = []
                    def response(r):
                        if r.url.startswith(args.api_url+'/api/products') and r.request.method in ('POST','PUT','DELETE'):
                            try:
                                mutations.append({'request':{'method':r.request.method,'url':r.url,'body':r.request.post_data_json,'authorization':'[REDACTED]'},'response':{'statusCode':r.status,'body':r.json()}})
                            except Exception as error:
                                mutations.append({'request':{'method':r.request.method,'url':r.url},'response':{'statusCode':r.status,'body':str(error)}})
                    page.on('response',response)
                    pending = set()
                    page.on('request',lambda r:pending.add(r) if r.url.startswith(args.api_url) else None)
                    page.on('requestfinished',lambda r:pending.discard(r))
                    page.on('requestfailed',lambda r:pending.discard(r))
                    page.goto(args.base_url)
                    page.wait_for_load_state('networkidle')
                    page.get_by_placeholder('Email',exact=True).fill('admin@eshop.com')
                    page.get_by_placeholder('Password',exact=True).fill('Admin123!')
                    page.get_by_role('button',name='Login',exact=True).click()
                    page.get_by_text('Sản phẩm',exact=True).click()
                    page.get_by_placeholder('Tên sản phẩm',exact=True).wait_for()
                    page.wait_for_load_state('networkidle')
                    settle(page,pending)
                    o['uiInitial'] = rows(page)
                    # Preserve rendered DOM reconnaissance once, before acting.
                    if c is suite[0]:
                        dom = out / 'initial-products-dom.html'
                        dom.write_text(page.content())
                    if c['action'] in ('Update','Delete'):
                        original = next(r for r in o['stateBefore'] if r['id'] == c['input']['target'])
                        row = page.locator('table tbody tr').filter(has=page.get_by_text(original['name'],exact=True))
                        row.get_by_role('button',name='Sửa' if c['action']=='Update' else 'Xóa',exact=True).click()
                    if c['action'] in ('Create','Update'):
                        b = c['input']['body']
                        page.get_by_placeholder('Tên sản phẩm',exact=True).fill(str(b.get('name') or ''))
                        page.get_by_placeholder('Giá tiền',exact=True).fill(str(b.get('price')) if b.get('price') is not None else '')
                        page.get_by_placeholder('URL Ảnh',exact=True).fill(b.get('imageUrl') or '')
                        page.get_by_placeholder('Mô tả',exact=True).fill(b.get('description') or '')
                        category = page.locator('form select')
                        if category.locator('option').count():
                            category.select_option(str(b['category_id']))
                        o['inputEffective'] = dict(name=page.get_by_placeholder('Tên sản phẩm',exact=True).input_value(),price=page.get_by_placeholder('Giá tiền',exact=True).input_value(),category_id=category.input_value())
                        o['htmlValidity'] = page.locator('form').evaluate('(form) => ({valid:form.checkValidity(), fields:[...form.elements].filter(e=>e.validity).map(e=>({placeholder:e.placeholder||e.tagName,valid:e.validity.valid,message:e.validationMessage}))})')
                        o['htmlBlocked'] = not o['htmlValidity']['valid']
                        page.get_by_role('button',name='Lưu sản phẩm',exact=True).click()
                    page.wait_for_load_state('networkidle')
                    settle(page,pending)
                    o['uiBeforeReload'] = rows(page)
                    shot = out / 'screenshots' / (c['id']+'_immediate.png')
                    page.screenshot(path=str(shot),full_page=True)
                    o['evidence'].append(str(shot.relative_to(REPO)) if shot.is_absolute() else str(shot))
                    o['stateAfter'] = fixture(args)
                    with urllib.request.urlopen(args.api_url+'/api/products') as readback:
                        o['apiReadback'] = {'statusCode':readback.status,'body':json.loads(readback.read())}
                    if mutations:
                        o['request'],o['response'] = mutations[-1]['request'],mutations[-1]['response']
                    o['mutationCount'] = len(mutations)
                    page.reload()
                    page.get_by_text('Sản phẩm',exact=True).click()
                    page.get_by_placeholder('Tên sản phẩm',exact=True).wait_for()
                    page.wait_for_load_state('networkidle')
                    settle(page,pending)
                    o['uiAfterReload'] = rows(page)
                    reload_shot = out / 'screenshots' / (c['id']+'_reload.png')
                    page.screenshot(path=str(reload_shot),full_page=True)
                    o['evidence'].append(str(reload_shot.relative_to(REPO)) if reload_shot.is_absolute() else str(reload_shot))
                    result = subprocess.check_output(['node',str(HERE / 'assert-products.cjs')],input=json.dumps({'c':c,'o':o}),text=True)
                    o.update(json.loads(result))
                    o['actual'] = {'failures':o.get('failures',[]),'beforeCount':len(o['stateBefore']),'afterCount':len(o['stateAfter']),'mutationCount':o['mutationCount'],'htmlBlocked':o.get('htmlBlocked',False),'response':o['response']}
                    if o['status'] != 'Blocked':
                        # Never count a truncated or replaced value as delivered.
                        effective = o.get('inputEffective')
                        intended = c['input']['body']
                        delivered = effective is None or (effective['name']==intended.get('name') and effective['price']==str(intended.get('price')))
                        o['exercisedObligations'] = c['obligations'] if delivered else []
                except Exception as error:
                    o.update(status='Blocked',blockReason='environment/harness: '+str(error),actual={'error':str(error)})
                finally:
                    o['endedAt'] = stamp()
                    if context is not None:
                        context.close()
                    o['evidence'].append(str(detail.relative_to(REPO)) if detail.is_absolute() else str(detail))
                    detail.write_text(json.dumps(o,ensure_ascii=False,indent=2)+'\n')
                    observations.append(o)
                    (out / 'observations.json').write_text(json.dumps(observations,ensure_ascii=False,indent=2)+'\n')
                    print(c['id'],o['status'],o.get('failures',[]),flush=True)
        finally:
            browser.close()

if __name__ == '__main__':
    main()
