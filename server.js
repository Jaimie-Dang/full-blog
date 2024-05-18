const express = require("express");
const path = require("path");
const fileupload = require("express-fileupload");

// Store "public" folder's path to this variable
let initial_path = path.join(__dirname, "public");

// Setup the server
const app = express();
app.use(express.static(initial_path));
// Cho phép máy sử dụng fileupload
app.use(fileupload());

// route tới trang chủ
app.get("/", (req, res) => {
  res.sendFile(path.join(initial_path, "home.html"));
});

// route tới trang editor
app.get("/editor", (req, res) => {
  res.sendFile(path.join(initial_path, "editor.html"));
});

// Tạo đường dẫn cho uploads (thư mục) / upload link => Sử dụng phương thức post
app.post("/upload", (req, res) => {
  let file = req.files.image;
  // Cho phép upload ảnh với thời gian cụ thể
  let date = new Date();
  // image name: tạo tên ảnh (gồm ngày + giờ + tên => để tên ảnh không bị trùng)
  let imagename = date.getDate() + date.getTime() + file.name;
  // image upload path
  let path = "public/uploads/" + imagename;

  // Sử dụng file.mv() để tạo đăng ảnh
  file.mv(path, (err, result) => {
    if (err) {
      throw err;
    } else {
      // Đường dẫn của hình ảnh đã tải
      res.json(`uploads/${imagename}`);
    }
  });
});
// Tạo dashboard
app.get("/admin", (req, res) => {
  res.sendFile(path.join(initial_path, "dashboard.html"));
});

// Tạo blog
app.get("/:blog", (req, res) => {
  res.sendFile(path.join(initial_path, "blog.html"));
});

// Tạo 404 route
app.use((req, res) => {
  res.json("404");
});

// start server by "npm start"
app.listen("3000", () => {
  console.log("Listening on Port: 3000");
});
