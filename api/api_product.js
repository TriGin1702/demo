const express = require("express");
const route = express.Router();
const multer = require("multer");
const { error } = require("console");
const fs = require("fs");
const time = Date.now();
const imageFolderPath = "D:/studyonweb/test_docker/public/image/";
const axios = require("axios");
const connect = require("../config/connect");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/image");
  },
  filename: (req, file, cb) => {
    cb(null, time + "-" + file.originalname);
  },
});
const upload = multer({ storage });
route.post("/create", upload.single("image"), (req, res) => {
  const sql =
    "INSERT INTO product (name, description, price,brand, image) VALUES (?, ?, ?, ?, ?)";
  const { name, description, price, brand, image } = req.body;
  console.log(name, description, price, brand, image);
  let dongbo;
  if (image !== null) {
    dongbo = time + "-" + image;
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
  return res.send("success");
});
route.delete("/delete/:id", upload.none(), async (req, res) => {
  try {
    const inputString = req.params.id;
    const splittedStrings = inputString.split("-");
    // Lấy hai chuỗi đã tách ra
    const id_product = splittedStrings[0];
    const ImageFileName = splittedStrings[1] + "-" + splittedStrings[2];
    await new Promise((resolve, reject) => {
      connect.query(
        "DELETE FROM product WHERE id = ?",
        [id_product],
        (err, result) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
    fs.readdir(imageFolderPath, (err, files) => {
      if (err) throw err;

      files.forEach((file) => {
        if (file === ImageFileName) {
          fs.unlinkSync(imageFolderPath + file);
          console.log(`${file} has been deleted.`);
        }
      });
    });
    res.send("Product deleted successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting product");
  }
});
// route.get("/", async (req, res) => {
//   try {
//     const rows = connect.query("SELECT * FROM product");
//     return res.json(rows);
//   } catch (err) {
//     console.error("Error retrieving products:", err);
//     return res.status(500).send("Internal Server Error");
//   }
// });
route.get("/", async (req, res) => {
  try {
    // Thực hiện truy vấn SQL để lấy toàn bộ dữ liệu từ bảng product
    const query = "SELECT * FROM product";
    const rows = await new Promise((resolve, reject) => {
      connect.query(query, (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res.send("error"); // Xử lý lỗi nếu truy vấn không thành công
  }
});
module.exports = route;