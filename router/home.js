const express = require("express");
const route = express.Router();
const multer = require("multer");
const fs = require("fs");
const { error } = require("console");
const imageFolderPath = "D:/studyonweb/test_docker/public/image/";
const time = Date.now();
const axios = require("axios");
const connect = require("../config/connect");
const productclass = require("../model/product");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/image");
  },
  filename: (req, file, cb) => {
    cb(null, time + "-" + file.originalname);
  },
});
const upload = multer({ storage });
route.get("/update/:id", async (req, res) => {
  const inputString = req.params.id;
  const splittedStrings = inputString.split("-");
  const firstPart = splittedStrings[0];
  try {
    const product = await new Promise((resolve, reject) => {
      connect.query(
        "select * from product where id = ?",
        [firstPart],
        (err, result) => {
          resolve(result);
        }
      );
    });
    return res.render("update", { product: product[0] });
  } catch (err) {
    return res.send(err);
  }
});
route.get("/delete/:id", upload.none(), async (req, res) => {
  const inputString = req.params.id;
  const response = await axios.delete(
    `http://localhost:3000/api/products/delete/${inputString}`
  );
  // Kiểm tra xem có lỗi khi gửi yêu cầu không
  if (response.status !== 200) {
    throw new Error("Failed to delete product");
  }
  return res.redirect("/");
});
route.get("/", async (req, res) => {
  try {
    const dataproduct = new productclass();
    const product = await dataproduct.getALLProducts();
    return res.render("admin", { product: product.data });
  } catch (err) {
    return res.send(err);
  }
});
route.post("/update/:id", upload.single("image"), async (req, res) => {
  const inputString = req.params.id;
  const splittedStrings = inputString.split("-");
  console.log(inputString);
  // Lấy phần id_product từ mảng splittedStrings
  const idProduct = splittedStrings[0];
  console.log(idProduct); // In ra id_product để kiểm tra xem nó đã đúng chưa

  // Tiếp tục lấy các phần tử khác nếu cần
  const date = splittedStrings[1];
  const imagename = splittedStrings[2];
  const ImageFileName = date + "-" + imagename;
  const { brand, name, description, gia } = req.body;
  const image = req.file ? req.file.originalname : ImageFileName;
  try {
    let dongbo = "";
    if (image.match(ImageFileName)) {
      dongbo = image;
    } else {
      dongbo = time + "-" + image;
    }

    fs.readdir(imageFolderPath, (err, files) => {
      if (err) throw err;

      files.forEach((file) => {
        if (file === ImageFileName) {
          fs.unlinkSync(imageFolderPath + file);
          console.log(`${file} has been deleted.`);
        }
      });
    });
    // Câu lệnh UPDATE đầu tiên
    connect.query(
      "UPDATE product SET name=?, description=?, price=?, brand=?, image=? WHERE id = ?",
      [name, description, gia, brand, dongbo, idProduct]
    );
    return res.redirect("/");
  } catch (err) {
    // Xử lý lỗi nếu có
    console.error("Lỗi trong quá trình thực hiện câu lệnh UPDATE:", err);
    return res
      .status(500)
      .send("Đã xảy ra lỗi trong quá trình cập nhật dữ liệu.");
  }
});
module.exports = route;
