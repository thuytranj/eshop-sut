"""Regression: don't sample UI before the event queue/network has settled."""
import importlib.util
from pathlib import Path
from playwright.sync_api import sync_playwright
spec = importlib.util.spec_from_file_location('fr15_web',Path(__file__).with_name('run-products-web.py'))
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.set_content("<body>old<script>setTimeout(()=>document.body.textContent='new',200)</script></body>")
    assert hasattr(module,'settle'), 'UI settling behavior not implemented'
    module.settle(page,set())
    assert page.locator('body').inner_text() == 'new', 'stale UI snapshot'
    browser.close()
print('UI settling regression passed')
