# Hướng dẫn Kiểm tra Thủ công và Cổng Phê duyệt (Manual Gates)

Tài liệu này ghi nhận hướng dẫn kiểm tra thủ công cho các hạng mục yêu cầu đối soát thực tế trên Google Chrome và thiết bị.

---

## 1. GUI-065: Kiểm tra bộ gõ tiếng Việt (IME Telex/VNI)
- **Màn hình**: FR-05 (Danh sách & Tìm kiếm sản phẩm)
- **Khía cạnh**: IA-02 (Biểu mẫu)
- **Mục đích**: Đảm bảo khi gõ tiếng Việt bằng bộ gõ OS thật (EVKey / UniKey / bộ gõ macOS), input không bị mất ký tự, nuốt phím hoặc nhảy con trỏ sai lệch qua các lần re-render.
- **Quy trình thực hiện**:
  1. Mở Chrome trên máy chạy, truy cập trang chủ `http://localhost:5173`.
  2. Bật bộ gõ tiếng Việt (Telex hoặc VNI).
  3. Nhập 3 cụm từ:
     - `dien thoai` -> `điện thoại`
     - `ban phim` -> `bàn phím`
     - `tai nghe` -> `tai nghe`
  4. Thử đặt con trỏ giữa từ và xóa/sửa ký tự.
  5. Ghi nhận: Công cụ gõ, OS, phiên bản Chrome, kết quả quan sát và đính kèm video/ảnh chụp màn hình.

---

## 2. GUI-066: Trợ năng đọc màn hình (Screen Reader & A11y)
- **Màn hình**: FR-07 (Chi tiết giỏ hàng)
- **Khía cạnh**: IA-01 (Tiêu chuẩn giao diện chung)
- **Mục đích**: Kiểm tra các nút icon (Xóa, Tăng/Giảm) có `aria-label` rõ nghĩa và thông báo động (toast) có `role="status"` hoặc `aria-live="polite"` để Screen Reader đọc được.
- **Quy trình thực hiện**:
  1. Bật VoiceOver (trên macOS: Command + F5) hoặc NVDA (trên Windows).
  2. Dùng phím Tab di chuyển vào giỏ hàng `http://localhost:5173/cart`.
  3. Lắng nghe VoiceOver đọc tên và vai trò của các nút trong từng dòng sản phẩm.
  4. Thực hiện xóa hoặc cập nhật và lắng nghe thông báo cập nhật trạng thái.
  5. Ghi nhận: Tên công cụ Screen Reader, phiên bản OS, kết quả đọc được.

---

## 3. GUI-069: Kích thước vùng bấm cảm ứng (Touch Target >= 44x44px) & Bàn phím ảo
- **Màn hình**: FR-07 (Chi tiết giỏ hàng)
- **Khía cạnh**: IA-01 (Tiêu chuẩn giao diện chung)
- **Mục đích**: Đảm bảo trên viewport thiết bị di động (360x800), các nút tương tác (+/−, Xóa, CTA) có diện tích tiếp xúc tối thiểu 44x44 CSS px.
- **Phần hoãn (Deferred)**: Kiểm tra tương tác bàn phím ảo đẩy layout trên thiết bị di động vật lý thật được hoãn ra ngoài phạm vi chạy Chrome máy trạm hiện tại theo Global Constraints.
- **Quy trình thực hiện trên Chrome**:
  1. Mở DevTools, chọn responsive mode 360x800.
  2. Đo kích thước bounding box của các nút thao tác.
  3. Xác nhận nút bấm có thể click được và không bị che khuất sau khi cuộn trang.

## Ảnh bằng chứng chuẩn (phiên chụp bổ sung)

Ảnh dưới đây thuộc phiên chụp bổ sung được ghi rõ trong manifest, không thay đổi môi trường, thời gian hoặc kết quả của lượt chạy lịch sử ở trên. Với báo cáo macOS cũ, ảnh Windows/Android là bằng chứng tái hiện riêng, không phải ảnh macOS gốc.

[Toàn bộ ảnh đã duyệt và độ phủ trên ba nền tảng](../cross-platform/browser-evidence/README.md). Bảng dưới liệt kê các checklist ID được nhắc trong báo cáo này.

| Checklist | Nền tảng chụp | Ảnh chuẩn | Kết quả ca tự động của phiên chụp | Phiên thật |
|---|---|---|---|---|
| GUI-065 | p1-chrome-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p1-chrome-win11/GUI-065.png) | passed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/64178bc5609b0048ab0e74d6874acda0af1a89ea) |
| GUI-065 | p2-firefox-win11 | Not Run — chờ kiểm tra thủ công | — | — |
| GUI-065 | p3-android-chrome | Not Run — chờ kiểm tra thủ công | — | — |
| GUI-066 | p1-chrome-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p1-chrome-win11/GUI-066.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/1c88c681a8ff706ba8fd4404b19b976496a8d9de) |
| GUI-066 | p2-firefox-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p2-firefox-win11/GUI-066.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/54d9faa6b177c8461ce283474a00428e515573c5) |
| GUI-066 | p3-android-chrome | [Xem ảnh](../cross-platform/browser-evidence/images/p3-android-chrome/GUI-066.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/b76a2c23f2c624cd04485a68a20d3f89734d77ec) |
| GUI-069 | p1-chrome-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p1-chrome-win11/GUI-069.png) | passed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/5475f6b7f231790d2cd47860e03d112f00ce7856) |
| GUI-069 | p2-firefox-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p2-firefox-win11/GUI-069.png) | passed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/dca465efed13fcffdf3db7e2b09abbc4e47b3d7f) |
| GUI-069 | p3-android-chrome | [Xem ảnh](../cross-platform/browser-evidence/images/p3-android-chrome/GUI-069.png) | passed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/bc225aa17be480bef82bd36644be404513583be4) |
