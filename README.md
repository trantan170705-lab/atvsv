# Trộn Đề & Chấm Điểm ATVSLĐ 2026 (Ngân hàng 120 Câu)

Website tĩnh tạo đề trắc nghiệm, trộn câu hỏi/đáp án ngẫu nhiên và chấm điểm tự động dành cho **Hội thi An toàn Vệ sinh viên giỏi lần thứ VIII - Năm 2026**.

## 🌟 Tính Năng Nổi Bật

- **Ngân hàng 120 câu hỏi chuẩn xác:** Trích xuất từ Bộ đề cương ôn tập Hội thi ATVSV 2026 với 3 phần kiến thức:
  - **Phần I:** Kiến thức về ATVSLĐ - PCCN (30 câu)
  - **Phần II:** Quy trình Kỹ thuật An toàn Điện (40 câu)
  - **Phần III:** Quy trình Kỹ thuật An toàn Nước (50 câu)
- **Tạo đề ngẫu nhiên (25 câu):** Rút ngẫu nhiên 25 câu từ toàn bộ ngân hàng 120 câu, hoán vị vị trí câu hỏi và thứ tự các phương án (A, B, C, D) hoàn toàn độc lập.
- **5 Mã đề cố định:** Phân bổ đầy đủ 120 câu hỏi theo 5 mã đề chuẩn (Mã đề 01 đến 05).
- **Luyện tập theo chuyên mục & Toàn bộ 120 câu:** Cho phép luyện tập riêng từng phần (I, II, III) hoặc làm trọn vẹn cả 120 câu.
- **Chấm điểm & Xem chi tiết đáp án:** Hiển thị số câu đúng, điểm số hệ 10, tỷ lệ phần trăm và xem lại từng câu làm đúng/sai ngay sau khi nộp bài.
- **🎭 Web Hiệu Lệnh Âm Thanh Sân Khấu (`/hieu-lenh` / `hieulenh.html`):** Ứng dụng bấm âm thanh theo lệnh chuyên dụng dành cho tiểu phẩm *"Hiểm họa chực chờ"*, điều khiển bằng Web Audio API, hỗ trợ PWA offline 100%, chống bấm nhầm và khóa re-trigger phím `SPACE`.

## 🎭 WEB HIỆU LỆNH ÂM THANH SÂN KHẤU ("HIỂM HỌA CHỰC CHỜ")

Mở ứng dụng bấm hiệu lệnh âm thanh sân khấu tại đường dẫn:
- **Local**: `hieulenh.html` hoặc `http://localhost:3000/hieu-lenh`
- **Vercel**: `https://[ten-app].vercel.app/hieu-lenh` (hoặc `/hieulenh`)

Xem hướng dẫn sử dụng tiếng Việt dành cho người không chuyên âm thanh tại file [HUONG_DAN_SU_DUNG_CUE.md](file:///c:/Users/PC/Desktop/atvsv/HUONG_DAN_SU_DUNG_CUE.md).

## 🚀 Chạy Tại Máy

Mở trực tiếp file `index.html` bằng trình duyệt (Chrome, Edge, Firefox...), hoặc chạy bằng server tĩnh Node.js:

```bash
npx serve . --single
```

Sau đó truy cập:
- Trang chủ: `http://localhost:3000`
- Web Hiệu Lệnh Âm Thanh: `http://localhost:3000/hieulenh`

## 📦 Hướng Dẫn Push Code Lên GitHub

Mở **Terminal / PowerShell** tại thư mục dự án `c:\Users\PC\Desktop\atvsv` và thực hiện lần lượt các lệnh sau để đẩy code lên GitHub repository [https://github.com/trantan170705-lab/atvsv](https://github.com/trantan170705-lab/atvsv):

```bash
# 1. Khởi tạo Git repository (nếu chưa có)
git init

# 2. Đổi tên nhánh mặc định thành main
git branch -M main

# 3. Thêm tất cả các file vào Git
git add .

# 4. Tạo bản ghi Commit
git commit -m "Thêm Web Cue Âm Thanh Sân Khấu (/cue) cho tiểu phẩm Hiểm Họa Chực Chờ ATVSLĐ 2026"

# 5. Liên kết tới GitHub Repository
git remote add origin https://github.com/trantan170705-lab/atvsv.git

# 6. Đẩy code lên GitHub
git push -u origin main
```

> **Lưu ý:** 
> - Nếu `remote origin` đã tồn tại từ trước, bạn có thể thay bước 5 bằng lệnh:
>   `git remote set-url origin https://github.com/trantan170705-lab/atvsv.git`
> - Nếu GitHub yêu cầu xác thực, hãy đăng nhập hoặc sử dụng Personal Access Token (PAT) / GitHub CLI để push.

## ☁️ Đưa Lên Vercel

1. Đẩy dự án lên GitHub theo hướng dẫn trên.
2. Truy cập [Vercel](https://vercel.com/), chọn **Add New → Project**.
3. Import Repository `atvsv` từ tài khoản GitHub.
4. Giữ nguyên các thiết lập mặc định và chọn **Deploy**.

## 📄 Dữ Liệu Ngân Hàng Câu Hỏi & Audio

- `ngan_hang_120_cau_trac_nghiem.md`: File Markdown lưu trữ toàn bộ 120 câu trắc nghiệm và đáp án đúng.
- `ngan_hang_120_cau_trac_nghiem.json`: File cấu trúc JSON chuẩn của 120 câu hỏi.
- `app.js`: Nhúng toàn bộ ngân hàng câu hỏi và xử lý logic hoán vị/chấm điểm.
- `cue.html` & `cue.js`: Giao diện & Động cơ Web Audio API điều khiển cue âm thanh sân khấu.
- `HUONG_DAN_SU_DUNG_CUE.md`: Hướng dẫn vận hành Web Cue Sân Khấu tiếng Việt.
- `audio/`: Thư mục chứa 5 file âm thanh MP3 chuẩn hóa cho 5 cue tiểu phẩm.

