const express = require("express");
const route = express.Router();
const multer = require("multer");
const { error } = require("console");
const time = Date.now();
const axios = require("axios");
var product = [];
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/image");
  },
  filename: (req, file, cb) => {
    cb(null, time + "-" + file.originalname);
  },
});
const upload = multer({ storage });
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
async function getALLProducts() {
  return await axios.get("http://localhost:3000/api/products");
}
route.get("/", async (req, res) => {
  try {
    const response = await getALLProducts();
    const product = response.data; // Truy cập thuộc tính data để lấy dữ liệu product
    return res.render("admin", { product: product });
  } catch (err) {
    return res.send(err);
  }
});
module.exports = route;
