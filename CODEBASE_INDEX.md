# Chỉ mục mã nguồn — ATVSV

> Cập nhật cấu trúc: mã trắc nghiệm nằm trong `trac-nghiem/`; mã hiệu lệnh và audio nằm trong `hieu-lenh/`. Các đường dẫn tệp ở các phần chi tiết bên dưới được hiểu theo hai thư mục này.

```text
atvsv/
├── trac-nghiem/       # index.html, app.js, styles.css, dữ liệu câu hỏi
├── hieu-lenh/         # hieulenh.*, sw.js, audio/, hướng dẫn audio
├── index.html         # chuyển đến /trac-nghiem/
└── vercel.json
```

## Tổng quan

Đây là website tĩnh (HTML/CSS/JavaScript thuần) phục vụ Hội thi An toàn vệ sinh viên giỏi 2026. Dự án có hai ứng dụng độc lập:

1. **Trộn đề & chấm điểm**: trang gốc, chọn đề, làm bài và xem đáp án.
2. **Web hiệu lệnh âm thanh sân khấu**: `/hieulenh`, phát và điều khiển 5 cue âm thanh cho tiểu phẩm.

Không có bước build, framework hay backend. Lệnh chạy cục bộ là `npm run dev` (dùng `npx serve .`).

## Điểm vào và tuyến đường

| URL / file | Mục đích | Tải mã |
| --- | --- | --- |
| `/` / `index.html` | Ứng dụng trắc nghiệm | `styles.css`, `app.js` |
| `/hieulenh` / `hieulenh.html` | Bảng điều khiển âm thanh | `hieulenh.css`, `hieulenh.js`, `sw.js` |
| `/hieu-lenh` | Alias đến trang hiệu lệnh | Vercel rewrite + Service Worker |
| `/cue` / `cue.html` | Tuyến cũ; chuyển hướng về `/hieulenh` | HTML redirect + Vercel rewrite |

`vercel.json` thiết lập clean URL, các redirect/rewrites trên và header chống cache dài hạn.

## Cấu trúc tệp

| Đường dẫn | Vai trò |
| --- | --- |
| `index.html` | Khung DOM cho trang trắc nghiệm: chọn chế độ, danh sách câu hỏi, kết quả. |
| `app.js` | Ngân hàng dự phòng, tải JSON, tạo đề, render, theo dõi tiến độ và chấm điểm. |
| `styles.css` | Giao diện trang trắc nghiệm. |
| `ngan_hang_120_cau_trac_nghiem.json` | Nguồn dữ liệu câu hỏi ưu tiên khi chạy qua HTTP. |
| `ngan_hang_120_cau_trac_nghiem.md` | Bản dữ liệu/đọc tham khảo ở Markdown. |
| `hieulenh.html` | Khung DOM bảng điều khiển cue âm thanh. |
| `hieulenh.js` | Web Audio engine, trạng thái cue, phím tắt, cài đặt cục bộ và PWA. |
| `hieulenh.css` | Giao diện bảng điều khiển cue. |
| `sw.js` | Pre-cache trang hiệu lệnh, mã, CSS và năm tệp âm thanh để hỗ trợ offline. |
| `audio/` | Năm tệp WAV tương ứng cue `00` đến `04`. |
| `cue.html` | Trang chuyển hướng tương thích ngược. |
| `cue.js`, `cue.css` | Bản mã hiệu lệnh cũ/không được `cue.html` nạp trực tiếp; chỉ sửa khi cần duy trì bản thay thế. |
| `HUONG_DAN_SU_DUNG_CUE.md` | Hướng dẫn vận hành bảng cue cho người dùng. |
| `DESIGN.md` | Tài liệu thiết kế giao diện/hành vi. |
| `README.md` | Giới thiệu, hướng dẫn chạy và triển khai. |

## Luồng ứng dụng trắc nghiệm

```text
index.html
  └─ app.js: bankData (fallback) + fetch JSON (nguồn ưu tiên)
       └─ makeExam()
            ├─ chọn pool theo mã đề / chuyên mục / ngẫu nhiên
            ├─ xáo thứ tự câu hỏi
            └─ render()
                 └─ cập nhật đáp án đã chọn và progress
                      └─ grade()
                           └─ kết quả, điểm /10 và đáp án chi tiết
```

### Hàm cần biết trong `app.js`

| Hàm | Trách nhiệm |
| --- | --- |
| `seeded(n)` | Tạo bộ sinh số giả ngẫu nhiên xác định cho mã đề cố định. |
| `shuffle(a, r)` | Xáo mảng theo Fisher–Yates. |
| `makeExam(seed, label, count, section)` | Chọn câu hỏi, chuyển sang màn làm bài và gọi render. |
| `render()` | Dựng câu hỏi/radio và gắn theo dõi tiến độ. |
| `updateProgress(count, total)` | Cập nhật số câu trả lời và thanh tiến độ. |
| `grade()` | Chấm bài, dựng phần giải chi tiết. |
| `home()` | Quay về màn chọn đề. |

### Quy tắc chọn câu

- Chuyên mục I/II/III lần lượt dùng các lát mảng `0–29`, `30–69`, `70–hết`.
- Mã đề 01–04 dùng từng nhóm 25 câu liên tiếp; mã 05 lấy phần còn lại rồi bù thêm câu nếu cần.
- Đề ngẫu nhiên chọn từ toàn bộ ngân hàng.
- Ứng dụng cố giữ thứ tự A–D của phương án; chỉ thứ tự câu hỏi bị xáo.

## Luồng ứng dụng cue âm thanh

```text
hieulenh.html
  └─ DOMContentLoaded
       ├─ preloadAllAudio() → fetch/decode 5 WAV, fallback âm tổng hợp nếu tải lỗi
       └─ initEvents()
            └─ triggerCue(index)
                 ├─ cue 00–03: AudioBufferSource + Gain automation
                 └─ cue 04: chuỗi ba giai đoạn (nền → cao trào → đỉnh/fade)
```

### Cue và tài nguyên

| Cue | Âm thanh | Hành vi chính |
| --- | --- | --- |
| `00` | Nhạc mở | Fade in; tự fade và dừng khoảng mốc 30 giây. |
| `01` | Chó sủa | Phát ngắn, tự dừng. |
| `02` | Bíp + máy in | Gain automation, tự dừng. |
| `03` | Rắn giật mình | Phát tức thời, tự dừng. |
| `04` | Nhạc kết | Ba lần GO/SPACE: nền → cao trào → đỉnh, giữ và fade out tự động. |

### Điểm chỉnh sửa trong `hieulenh.js`

- `DEFAULT_CUES`: đường dẫn audio, dấu hiệu sân khấu, mức âm lượng và thời lượng mặc định.
- `preloadAllAudio()`: tải/giải mã audio; lỗi tệp sẽ dùng `createSyntheticBuffer()` thay thế.
- `triggerCue()` và `handleCue04Sequence()`: logic phát cue.
- `updateUI()`: đồng bộ thẻ cue hiện tại, sidebar, nút điều khiển.
- `saveSettingsFromInputs()` / `loadSavedCues()`: lưu cấu hình cue trong `localStorage` với khóa `cue_configs_v2`.
- Âm lượng master dùng khóa `cue_master_vol` trong `localStorage`.

Phím tắt: `Space` phát/tiến cue, `F` fade & kết thúc, `Esc` dừng khẩn cấp, mũi tên trái/phải đổi cue khi không phát, `R` thử cue trong chế độ tập luyện.

## Phụ thuộc và triển khai

- Runtime chỉ dùng Web Platform APIs: Fetch, Web Audio API, Service Worker, Wake Lock, Fullscreen và Local Storage.
- Font Inter được nạp từ Google Fonts; phần còn lại không phụ thuộc thư viện npm.
- `package.json` chỉ cung cấp `dev` và `start`; Vercel có thể triển khai như static site.

## Lưu ý bảo trì

- `app.js` vừa chứa ngân hàng fallback vừa tải `ngan_hang_120_cau_trac_nghiem.json`; khi cập nhật câu hỏi nên đồng bộ cả hai nếu cần hỗ trợ mở trực tiếp từ file.
- Khi thêm/đổi tệp audio, cập nhật đồng thời `DEFAULT_CUES` trong `hieulenh.js` và `ASSETS_TO_CACHE` trong `sw.js`; tăng `CACHE_NAME` để client nhận cache mới.
- `cue.js` và `cue.css` không phải tài nguyên của route `/cue` hiện tại. Tránh sửa chúng thay cho `hieulenh.js`/`hieulenh.css` nếu mục tiêu là ứng dụng đang hoạt động.
- Các tệp Word/PDF ở gốc là tài liệu nguồn, không được website nạp trực tiếp.
