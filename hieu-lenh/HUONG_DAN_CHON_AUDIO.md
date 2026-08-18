# Hướng dẫn chọn âm thanh cho Web Hiệu lệnh

Tài liệu này liệt kê các tệp âm thanh đang được ứng dụng hiệu lệnh sử dụng, mục đích sân khấu và từ khóa để tìm âm thanh thay thế phù hợp.

Nguồn có thể dùng: [Pixabay Sound Effects](https://pixabay.com/sound-effects/). Ưu tiên nghe thử và tải tệp trước khi đưa vào buổi tập.

## Danh sách âm thanh

### Nhạc dự phòng sân khấu

- **Tệp đích:** `audio/00_NHAC_MO_DON_SAN_KHAU.mp3`
- **Cách dùng:** chỉ mở khi sân khấu gặp sự cố hoặc cần thêm thời gian chuẩn bị; nhạc phát lặp đến khi người điều khiển giảm dần/dừng.
- **Thời lượng:** ưu tiên đoạn nhạc có thể lặp mượt, tối thiểu 15 giây.
- **Từ khóa tìm kiếm:**
  - `upbeat comedy intro instrumental`
  - `funny theater opening music`
  - `light playful background music no vocals`

### Lệnh 01 — Tiếng chó sủa

- **Tệp đích:** `audio/01_CHO_SUA.mp3`
- **Thời lượng:** khoảng 1–3 giây.
- **Dùng khi:** nhân vật Phượng xuất hiện.
- **Từ khóa tìm kiếm:**
  - `small dog bark single`
  - `dog bark short`
  - `cartoon dog bark`

### Lệnh 03 — Hiệu ứng rắn xuất hiện

- **Tệp đích:** `audio/03_RAN_GIAT_MINH.mp3`
- **Thời lượng:** khoảng 1–2 giây.
- **Từ khóa tìm kiếm:**
  - `snake hiss short`
  - `snake movement sound effect`
  - `cartoon snake hiss`

### Lệnh 04 — Sấm chớp báo trời sắp mưa

- **Tệp đích đề xuất:** `audio/04_SAM_CHOP.mp3`
- **Thời lượng:** khoảng 2–4 giây.
- **Dùng khi:** sau lời động viên của Chị chủ nhà ở Phân cảnh 3, ngay trước câu của Anh Nguyên: “Vậy thôi mình đi tiếp chị Phượng ơi, chứ em thấy trời sắp mưa rồi đó.”
- **Âm thanh nên có:** một tiếng sấm rõ, có thể kèm tiếng mưa hoặc gió rất ngắn; vào âm ngay, không có đoạn nhạc mở đầu.
- **Từ khóa tìm kiếm trên Pixabay:**
  - `thunder clap short`
  - `thunderstorm sound effect`
  - `distant thunder short`
  - `thunder rain ambience short`
  - `cinematic thunder hit`
- **Nên tránh:** bản mưa kéo dài, tiếng sấm quá chói hoặc nhiều tiếng sét liên tục vì sẽ che câu thoại tiếp theo.

### Lệnh 05 — Nhạc kết và cao trào

- **Tệp đích:** `audio/05_NHAC_KET.mp3`
- **Thời lượng:** tối thiểu 40 giây.
- **Dùng cho:** nhạc nền, tăng cao trào, rồi đỉnh kết thúc.
- **Từ khóa tìm kiếm:**
  - `inspiring cinematic finale instrumental`
  - `uplifting ending music no vocals`
  - `triumphant corporate finale`
  - `positive climax music`

## Tiêu chí chọn

- Chọn âm thanh **không lời** (`no vocals`) để không che lời diễn viên.
- Cue 01, 03 và 04 cần vào âm nhanh, rõ, không có khoảng lặng dài ở đầu tệp.
- Nhạc dự phòng cần có đoạn đầu/cuối tương đối liền mạch để phát lặp không gây giật; cue 05 cần có phần âm nhạc đều, không kết thúc đột ngột trước thời lượng yêu cầu.
- Với cue 03, ưu tiên tiếng rắn hoặc hiệu ứng xuất hiện ngắn, vào âm ngay từ đầu tệp.
- Tránh tiếng trống hoặc bass quá mạnh khi diễn viên còn đang thoại.
- WAV và MP3 đều có thể phát được trong ứng dụng. Khi thay tệp, phải giữ đúng tên/đuôi đã cấu hình; hiện cả bốn tệp đang dùng `.mp3`.

## Quy trình thay tệp

1. Tải tệp về và nghe thử bằng loa sẽ dùng khi tập/biểu diễn.
2. Cắt đoạn cần thiết, kiểm tra không có khoảng lặng đầu/cuối không mong muốn.
3. Đổi tên tệp theo đúng tên trong bảng và thay vào thư mục `audio/`.
4. Mở trang `/hieu-lenh` để kiểm tra lần lượt từng lệnh.
5. Nếu trang đã từng chạy trên thiết bị, bấm **LÀM MỚI ÂM THANH** trên thanh đầu trang. Nút này xóa cache âm thanh của ứng dụng và tải lại trang. Khi đổi tên hoặc đường dẫn tệp, cũng tăng `CACHE_NAME` trong `sw.js`.

## Ghi chú giấy phép

Theo [tóm tắt giấy phép Pixabay](https://pixabay.com/service/license-summary/), nội dung thường được sử dụng miễn phí, có thể chỉnh sửa và thường không bắt buộc ghi nguồn. Vẫn cần kiểm tra điều kiện của từng tệp trước khi sử dụng công khai.
