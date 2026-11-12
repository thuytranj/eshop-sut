# Not Run recovery results

Generated: 2026-11-11T14:50:50.107Z

Baseline: qual-02; targeted reruns use the same backend/web/admin source digests. Results combine baseline cells with the explicitly listed rerun cohorts; this is not a single fresh full run.

| Platform | Passed | Failed | Not Run | Not Run rate |
|---|---:|---:|---:|---:|
| p1-chrome-win11 | 14 | 56 | 0 | 0.00% |
| p2-firefox-win11 | 19 | 50 | 1 | 1.43% |
| p3-android-chrome | 9 | 60 | 1 | 1.43% |

**Not Run: 57/210 (27.14%) → 2/210 (0.95%).**

## Remaining checks

- GUI-065 / p2-firefox-win11: Missing required cases: ime-manual
- GUI-065 / p3-android-chrome: Missing required cases: ime-manual

## Evidence and provenance

Recovered failed cells without a persisted screenshot: 0. See [evidence gaps](evidence-gaps.json).

- [Cell reasons, attempts and evidence paths](cells.json)
- [Cohort/source provenance](provenance.json)
- [Provider session appendix](session-appendix.md)

No manual keyboard/IME or screen-reader execution is fabricated. Original qual-02 results are preserved. Earlier baseline evidence has not been independently revalidated in this recovery.

## Supplemental browser-window screenshots

[Use the reviewed submission screenshot set](../browser-evidence/README.md): native browser toolbar + address URL + web interface + student email. Original outcomes and evidence are preserved.

## Ảnh bằng chứng chuẩn (phiên chụp bổ sung)

Ảnh dưới đây thuộc phiên chụp bổ sung được ghi rõ trong manifest, không thay đổi môi trường, thời gian hoặc kết quả của lượt chạy lịch sử ở trên. Với báo cáo macOS cũ, ảnh Windows/Android là bằng chứng tái hiện riêng, không phải ảnh macOS gốc.

[Toàn bộ ảnh đã duyệt và độ phủ trên ba nền tảng](../browser-evidence/README.md). Bảng dưới liệt kê các checklist ID được nhắc trong báo cáo này.

| Checklist | Nền tảng chụp | Ảnh chuẩn | Kết quả ca tự động của phiên chụp | Phiên thật |
|---|---|---|---|---|
| GUI-065 | p1-chrome-win11 | [Xem ảnh](../browser-evidence/images/p1-chrome-win11/GUI-065.png) | passed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/64178bc5609b0048ab0e74d6874acda0af1a89ea) |
| GUI-065 | p2-firefox-win11 | Not Run — chờ kiểm tra thủ công | — | — |
| GUI-065 | p3-android-chrome | Not Run — chờ kiểm tra thủ công | — | — |
