const express = require("express");
const router = express.Router();
const time = Date.now();
const multer = require("multer");
const connect = require("./config/connect");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/image");
  },
  filename: (req, file, cb) => {
    cb(null, time + "-" + file.originalname);
  },
});
const upload = multer({ storage });
router.get("/", async (req, res) => {
  try {
    res.render("create");
  } catch (err) {
    console.error(err);
    res.send("error"); // Xử lý lỗi nếu truy vấn không thành công
  }
});
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const sql =
      "INSERT INTO product (name, description, price,brand, image) VALUES (?, ?, ?, ?, ?)";
    const name = req.body.name;
    const description = req.body.description;
    const price = req.body.gia;
    const brand = req.body.brand;
    console.log(name, description, price, brand);
    let dongbo;
    if (req.file) {
      dongbo = time + "-" + req.file.originalname;
    } else {
      dongbo = "image.png";
    }
    connect.query(
      sql,
      [name, description, price, brand, dongbo],
      (err, result) => {
        if (err) {
          console.error("Error saving product:", err);
        } else {
          console.log("Product saved:", result);
        }
      }
    );

    // Trả về kết quả thành công hoặc thất bại cho người dùng
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.send("Error sending data"); // Xử lý lỗi nếu gửi dữ liệu không thành công
  }
});
module.exports = router;
