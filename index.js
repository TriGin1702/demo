const express = require("express");
const app = express();

// Cấu hình Express và các middleware khác
require("./config/express")(app);

// Cấu hình các routes API
const productRoutes = require("./api/api_product");
const admin = require("./home");
const create = require("./create");
app.use("/api/products", productRoutes);
app.use("/create", create);
app.use("/", admin);
// Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
