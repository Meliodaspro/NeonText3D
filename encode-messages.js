const fs = require('fs');
const path = require('path');

// Đường dẫn file JS build đầu ra
const jsPath = path.join(__dirname, 'dist/assets/index.min.js');

// Mảng messages gốc
const messages = [
  "Nguyễn Phương Uyên ♡",
  "Hồng Sơn ♡ Phương Uyên",
  "Anh yêu em nhiều lắm",
  "Em là duy nhất",
  "Mãi bên nhau nhé ♡"
];

// Mã hóa base64 an toàn Unicode
function encodeUnicode(str) {
  return Buffer.from(encodeURIComponent(str)).toString('base64');
}
const encoded = encodeUnicode(JSON.stringify(messages));

// Regex tìm đúng đoạn có comment // ENCODE_MESSAGES trước mảng messages
const regex = /\/\/ ENCODE_MESSAGES\s*const messages = \[[\s\S]*?\];/g;
const replacement = `\nfunction decodeUnicode(str) {\n  return decodeURIComponent(Array.prototype.map.call(atob(str), c =>\n    '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)\n  ).join(''));\n}\nconst encodedMessages = "${encoded}";\nconst messages = JSON.parse(decodeUnicode(encodedMessages));\n`;

let code = fs.readFileSync(jsPath, 'utf8');
const newCode = code.replace(regex, replacement);
fs.writeFileSync(jsPath, newCode, 'utf8');

console.log('Đã mã hóa mảng messages (base64, Unicode safe) trong file build!'); 