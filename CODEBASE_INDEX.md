# Chỉ mục mã nguồn — ATVSV

> Cập nhật cấu trúc: mã trắc nghiệm nằm trong `trac-nghiem/`; mã hiệu lệnh và audio nằm trong `hieu-lenh/`. Các đường dẫn tệp ở các phần chi tiết bên dưới được hiểu theo hai thư mục này.

```text
atvsv/
├── trac-nghiem/       # app.js, styles.css, dữ liệu câu hỏi
├── hieu-lenh/         # hieulenh.*, sw.js, audio/, hướng dẫn audio
├── tu-luan/            # trang quay câu hỏi tự luận theo thí sinh/chủ đề
├── Học lý thuyết/      # tài liệu DOCX nguồn và các bản chuyển Markdown
├── index.html         # trang trắc nghiệm ở URL gốc /
└── vercel.json
```

## Tổng quan

Đây là website tĩnh (HTML/CSS/JavaScript thuần) phục vụ Hội thi An toàn vệ sinh viên giỏi 2026. Dự án có hai ứng dụng độc lập:

1. **Trộn đề & chấm điểm**: trang gốc, chọn đề, làm bài và xem đáp án.
2. **Web hiệu lệnh âm thanh sân khấu**: `/hieu-lenh`, phát và điều khiển 4 cue kịch bản cùng 1 nhạc dự phòng.
3. **Quay câu hỏi tự luận**: `/tu-luan`, chọn Kha/Tú/Vy và quay câu hỏi theo chủ đề.

Không có bước build, framework hay backend. Lệnh chạy cục bộ là `npm run dev` (dùng `npx serve .`).

## Điểm vào và tuyến đường

| URL / file | Mục đích | Tải mã |
| --- | --- | --- |
| `/` / `index.html` | Ứng dụng trắc nghiệm | `trac-nghiem/styles.css`, `trac-nghiem/app.js` |
| `/hieu-lenh` | Bảng điều khiển âm thanh | `hieu-lenh/index.html`, `hieulenh.css`, `hieulenh.js`, `sw.js` |
| `/tu-luan` | Trang quay câu hỏi tự luận | `tu-luan/index.html`, `styles.css`, `app.js` |
| `/hieulenh` / `/hieulenh.html` | Tuyến cũ; chuyển hướng về `/hieu-lenh` | Vercel redirect |

`vercel.json` thiết lập clean URL, các redirect/rewrites trên và header chống cache dài hạn.

## Cấu trúc tệp

| Đường dẫn | Vai trò |
| --- | --- |
| `index.html` | Khung DOM cho trang trắc nghiệm: chọn chế độ, danh sách câu hỏi, kết quả. |
| `trac-nghiem/app.js` | Ngân hàng dự phòng, tải JSON, tạo đề, render, theo dõi tiến độ và chấm điểm. |
| `trac-nghiem/styles.css` | Giao diện trang trắc nghiệm. |
| `trac-nghiem/ngan_hang_120_cau_trac_nghiem.json` | Nguồn dữ liệu câu hỏi ưu tiên khi chạy qua HTTP. |
| `trac-nghiem/ngan_hang_120_cau_trac_nghiem.md` | Bản dữ liệu/đọc tham khảo ở Markdown. |
| `hieu-lenh/index.html` | Khung DOM bảng điều khiển âm thanh. |
| `hieu-lenh/hieulenh.js` | Web Audio engine, trạng thái cue, phím tắt, cài đặt cục bộ và PWA. |
| `hieu-lenh/hieulenh.css` | Giao diện bảng điều khiển. |
| `hieu-lenh/sw.js` | Pre-cache trang hiệu lệnh, mã, CSS và bốn tệp âm thanh để hỗ trợ offline. |
| `hieu-lenh/audio/` | Bốn tệp MP3: dự phòng, chó sủa, rắn xuất hiện và nhạc kết. |
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
hieu-lenh/index.html
  └─ DOMContentLoaded
       ├─ preloadAllAudio() → fetch/decode 4 MP3, fallback âm tổng hợp nếu tải lỗi
       └─ initEvents()
            └─ triggerCue(index)
                 ├─ cue 01, 03 và nhạc dự phòng: AudioBufferSource + Gain automation
                 └─ cue 05: chuỗi ba giai đoạn (nền → cao trào → đỉnh/fade)
```

### Cue và tài nguyên

| Cue | Âm thanh | Hành vi chính |
| --- | --- | --- |
| `00` | Nhạc dự phòng | Phát lặp khi có sự cố hoặc cần chờ sân khấu; dừng thủ công. |
| `01` | Chó sủa | Phát ngắn, tự dừng. |
| `03` | Rắn xuất hiện | Phát tức thời, tự dừng. |
| `04` | Sấm chớp | Phát ngắn, tự dừng. |
| `05` | Nhạc kết | Ba lần GO/SPACE: nền → cao trào → đỉnh, giữ và fade out tự động. |

### Điểm chỉnh sửa trong `hieulenh.js`

- `DEFAULT_CUES`: đường dẫn audio, dấu hiệu sân khấu, mức âm lượng và thời lượng mặc định.
- `preloadAllAudio()`: tải/giải mã audio; lỗi tệp sẽ dùng `createSyntheticBuffer()` thay thế.
- `triggerCue()` và `handleCue04Sequence()`: logic phát cue.
- `updateUI()`: đồng bộ thẻ cue hiện tại, sidebar, nút điều khiển.
- `saveSettingsFromInputs()` / `loadSavedCues()`: lưu cấu hình cue trong `localStorage` với khóa `cue_configs_v3`.
- Âm lượng master dùng khóa `cue_master_vol` trong `localStorage`.

Phím tắt: `Space` phát/tiến cue, `F` fade & kết thúc, `Esc` dừng khẩn cấp, mũi tên trái/phải đổi cue khi không phát, `R` thử cue trong chế độ tập luyện.

## Phụ thuộc và triển khai

- Runtime chỉ dùng Web Platform APIs: Fetch, Web Audio API, Service Worker, Wake Lock, Fullscreen và Local Storage.
- Font Inter được nạp từ Google Fonts; phần còn lại không phụ thuộc thư viện npm.
- `package.json` chỉ cung cấp `dev` và `start`; Vercel có thể triển khai như static site.

## Lưu ý bảo trì

- `app.js` vừa chứa ngân hàng fallback vừa tải `ngan_hang_120_cau_trac_nghiem.json`; khi cập nhật câu hỏi nên đồng bộ cả hai nếu cần hỗ trợ mở trực tiếp từ file.
- Khi thêm/đổi tệp audio, cập nhật đồng thời `DEFAULT_CUES` trong `hieulenh.js` và `ASSETS_TO_CACHE` trong `sw.js`; tăng `CACHE_NAME` để client nhận cache mới.
- Các tệp Word/PDF ở gốc là tài liệu nguồn, không được website nạp trực tiếp.
