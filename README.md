
---

## Các thư viện cần thiết

- [three.js](https://threejs.org/) (dùng qua npm hoặc CDN)
- [postprocessing](https://github.com/vanruesc/postprocessing) (npm)
- Font Việt hóa dạng `.json` (convert từ .ttf/.otf bằng [facetype.js](https://gero3.github.io/facetype.js/))

---

## Cài đặt & Deploy trên cPanel

### 1. Build project (nếu dùng Vite/npm)

Nếu bạn phát triển local với Vite/npm:
```bash
npm install
npm run build
```
Sau đó lấy thư mục `dist` để upload lên hosting.

### 2. Upload lên cPanel

- Đăng nhập cPanel.
- Vào **File Manager**.
- Upload toàn bộ file/folder (index.html, script.js, thư mục fonts, v.v...) vào thư mục public_html hoặc thư mục con bạn muốn.
- Đảm bảo file font Việt hóa `.json` nằm đúng đường dẫn (ví dụ: `/fonts/hongson.json`).

### 3. Sửa đường dẫn font trong code (nếu cần)

```js
loader.load('/fonts/hongson.json', (font) => {
  // ...
});
```
> Nếu bạn upload vào thư mục con, hãy sửa lại đường dẫn cho đúng.

### 4. Không cần cài đặt npm trên cPanel

- Chỉ cần upload các file đã build (không cần node_modules).
- Nếu dùng npm để phát triển, chỉ dùng local, không cần trên hosting.

---

## Lưu ý

- Nếu dùng font Việt hóa khác, hãy convert sang `.json` và upload vào thư mục `/fonts/`.
- Nếu muốn sửa nội dung chữ, chỉ cần sửa trong file `script.js`.
- Nếu muốn đổi số lượng sao, trái tim, hoặc hiệu ứng glow, chỉnh các biến tương ứng trong `script.js`.

---

## Demo nhanh local (không cần npm)

1. Đảm bảo có các file: `index.html`, `index.js`, `./fonts/hongson.json`.
2. Mở `index.html` bằng trình duyệt hoặc dùng Live Server (VSCode extension).

---
###cách tạo font json
- tìm và tải font ở [Goolefont](https://fonts.google.com/)
- truy cập [jsonfont](https://gero3.github.io/facetype.js/)
 - tải font ttf vừa tải về sau đó up lên và convert thành json


## Liên hệ & hỗ trợ

Nếu gặp lỗi font, hiệu ứng hoặc cần font Việt hóa khác, hãy liên hệ người phát triển hoặc để lại issue trên repo.
