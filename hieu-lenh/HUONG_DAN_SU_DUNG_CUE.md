# 🎭 HƯỚNG DẪN SỬ DỤNG WEB HIỆU LỆNH ÂM THANH SÂN KHẤU
## Tiểu Phẩm: "HIỂM HỌA CHỰC CHỜ" (Hội thi ATVSV 2026)

Ứng dụng web chuyên dụng dành cho **người không chuyên âm thanh**, điều khiển toàn bộ 4 file âm thanh theo kịch bản biểu diễn sân khấu trực tiếp chỉ với **1 phím SPACE**.

---

## 🚀 1. Hướng Dẫn Chạy & Truy Cập

### 📍 Mở trực tiếp trên trình duyệt
1. Mở file `index.html` trong thư mục `hieu-lenh/` bằng trình duyệt (Chrome, Microsoft Edge, Firefox, Brave,...).
2. Hoặc truy cập đường dẫn thuần Việt: `https://[domain-cua-ban]/hieu-lenh` hoặc `https://[domain-cua-ban]/hieulenh`.

### ☁️ Triển khai lên Vercel
1. Đẩy mã nguồn dự án lên GitHub repository.
2. Đăng nhập vào [Vercel](https://vercel.com/), chọn **Add New → Project** và chọn repository `atvsv`.
3. Nhấn **Deploy**.
4. Ứng dụng Web Hiệu Lệnh Âm Thanh sẽ hoạt động trực tiếp tại địa chỉ:
   - `https://[ten-app].vercel.app/hieu-lenh`
   - `https://[ten-app].vercel.app/hieulenh`
   - `https://[ten-app].vercel.app/hieulenh.html`

---

## 📋 2. Kịch Bản & Phân Bổ Dấu Hiệu Bấm Âm Thanh

| Mã Lệnh | Dấu Hiệu Sân Khấu | Thao Tác | Âm Lượng & Timeline |
| :---: | :--- | :---: | :--- |
| **Dự phòng** | Sân khấu gặp sự cố hoặc cần thêm thời gian chuẩn bị | Nút **NHẠC DỰ PHÒNG SÂN KHẤU** | Phát lặp ở 55%; bấm <kbd>F</kbd> để giảm dần/dừng hoặc dùng **DỪNG NGAY**. |
| **01** | Phượng chuẩn bị chạy vào | <kbd>SPACE</kbd> | 72% (Tiếng chó sủa phát 2.45s ➔ tự tắt) |
| **03** | Nắp hộp đồng hồ vừa mở (rắn xuất hiện) | <kbd>SPACE</kbd> | 80% (HISS + IMPACT 1.05s ➔ tự tắt, trệ = 0ms) |
| **04.1** | Cán bộ An toàn bước ra giữa sân khấu | <kbd>SPACE</kbd> | 28% (Nhạc nền nhẹ, không át lời thoại) |
| **04.2** | Dứt câu *"...chúng tôi mang đến thông điệp:"* | <kbd>SPACE</kbd> | 28% ➔ 48% (Ramp 1.2s, giữ 48% khi hô khẩu hiệu) |
| **04.3** | Dứt chữ *"PHỤC VỤ!"* khi hô xong | <kbd>SPACE</kbd> | 48% ➔ 72% (Hold 1.8s ➔ Fade out 2.8s ➔ Tự động hoàn thành) |

---

## 📊 3. Tỷ Lệ Âm Lượng Tương Đối Chuẩn (Gain Levels)

* **Nhạc nền thông điệp (Lệnh 04.1)**: `28%`
* **Nhạc cao trào trước hô (Lệnh 04.2)**: `48%`
* **Nhạc dọn sân khấu (Lệnh 00)**: `55%`
* **Tiếng chó sủa (Lệnh 01)**: `72%`
* **Đỉnh nhạc kết (Lệnh 04.3)**: `72%`
* **Rắn xuất hiện (Lệnh 03)**: `80%` (Phát ngắn 1.0s, trệ = 0ms)
* **Âm lượng tổng (Master Volume)**: Khuyên dùng `65%` (có thể tăng giảm tùy loa thực tế).

---

## ⏱️ 3. Chế Độ Tự Động Hẹn Giờ Giảm Âm Lượng & Tắt (Auto Fade & Stop)

Hệ thống đã hỗ trợ tính năng **Tự động hẹn giờ**:
- Khi bấm **`SPACE`** để phát nhạc (ví dụ **Lệnh 00 Nhạc mở dọn sân khấu**), bạn **KHÔNG BẮT BUỘC** phải canh thời gian bấm phím `F` hay nút Fade nữa!
- Nhạc sẽ tự động chạy đúng số giây đã cài đặt (mặc định **25 giây** cho Lệnh 00), sau đó **tự động giảm mượt âm lượng trong 2 giây**, tắt hẳn và tự động chuyển sang trạng thái chờ của **Lệnh 01**.
- **Tùy chỉnh số giây tự động**: Vào menu **⚙ CÀI ĐẶT** ➔ Nhập số giây mong muốn tại cột **"Tự động Fade sau (s)"** ➔ Nhấn **💾 LƯU CẤU HÌNH**.
- *Lưu ý*: Nếu diễn viên dọn sân khấu xong sớm hơn dự kiến, bạn vẫn có thể bấm **`F`** bất cứ lúc nào để nhạc giảm nhỏ và tắt ngay lập tức mà không cần chờ hết timer.

---

## 🕹️ 4. Danh Sách Phím Tắt Điều Khiển

| Phím Tắt | Chức Năng |
| :---: | :--- |
| <kbd>SPACE</kbd> | **PHÁT LỆNH / CAO TRÀO**: Phát lệnh âm thanh hiện tại hoặc đẩy cao trào nhạc kết (Lệnh 04). |
| <kbd>F</kbd> | **GIẢM NHỎ & DỪNG**: Giảm nhỏ âm lượng mượt mà rồi dừng (dành cho Lệnh 00 và Lệnh 04). |
| <kbd>ESC</kbd> | **DỪNG KHẨN CẤP**: Dừng ngay lập tức toàn bộ âm thanh đang phát. |
| <kbd>←</kbd> / <kbd>→</kbd> | **CHUYỂN LỆNH**: Quay lại lệnh trước hoặc chuyển sang lệnh tiếp theo. |
| <kbd>R</kbd> | **PHÁT LẠI**: Phát lại lệnh âm thanh (chỉ hoạt động trong Chế độ Tập luyện). |

---

## ⚙️ 4. Quy Trình Checklist Chuẩn Bị Trước Khi Thi Biểu Diễn

1. **Bước 1**: Mở trình duyệt laptop (khuyên dùng Chrome hoặc Edge).
2. **Bước 2**: Truy cập URL Vercel `/hieu-lenh`.
3. **Bước 3**: Kiểm tra thông báo **4/4 ÂM THANH ĐÃ NẠP – SẴN SÀNG**.
4. **Bước 4**: Nhấn nút lớn **🔊 KHỞI ĐỘNG ÂM THANH** để mở khóa Web Audio API.
5. **Bước 5**: Nhấn nút **⛶ TOÀN MÀN HÌNH** để tránh bấm nhầm các tab trình duyệt.
6. **Bước 6**: Đặt **ÂM LƯỢNG TỔNG** ở mức 70% – 80% tùy theo hệ thống loa sân khấu.
7. **Bước 7**: Thử nhấn phím `SPACE` chạy thử Lệnh 00, thử bấm `F` fade stop, thử bấm `ESC` Dừng khẩn cấp.
8. **Bước 8**: Bấm nút **↻ VỀ LỆNH ĐẦU** để đưa kịch bản về **LỆNH 00** trước khi MC cất lời.

---

## 🎵 5. Hướng Dẫn Thay Thế File Âm Thanh

Nếu bạn muốn thay file âm thanh MP3 thực tế:
1. Chuẩn bị file `.mp3` của bạn.
2. Đổi tên file trùng khớp chính xác với 4 tên sau:
   * `00_NHAC_MO_DON_SAN_KHAU.mp3`
   * `01_CHO_SUA.mp3`
   * `03_RAN_GIAT_MINH.mp3`
   * `04_NHAC_KET.mp3`
3. Chép đè các file này vào thư mục `hieu-lenh/audio/` của dự án.
4. Mở lại web và bấm **Khởi động âm thanh**.

---

## 🛡️ 6. Các Chức Năng Bảo Vệ Chống Thao Tác Nhầm

* **Chống đúp phím SPACE**: Hệ thống tự động chặn phím giữ liên tục (`event.repeat`) và vô hiệu hóa nút PHÁT LỆNH ngay sau khi kích hoạt.
* **Chống máy ngủ (Wake Lock API)**: Tự động giữ màn hình laptop luôn sáng, không bị sleep hay tắt màn hình khi đang biểu diễn.
* **Cảnh báo mất Focus**: Hiển thị thanh cảnh báo nếu người điều khiển vô tình chuyển tab trình duyệt khác.
* **Chạy Offline 100% (PWA)**: Khi đã nạp âm thanh 1 lần, ứng dụng lưu cache toàn bộ file vào trình duyệt, có thể chạy bình thường ngay cả khi rút dây mạng hoặc mất Wifi.
