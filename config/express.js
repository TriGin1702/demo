const express = require("express");
const session = require("express-session");
var handlebars = require("express-handlebars");
const cookieParser = require("cookie-parser");
const path = require("path"); // Import module path

module.exports = function (app) {
  // Cài đặt các middleware
  const port = 3000;
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(
    session({
      secret: "your-secret-key",
      resave: true,
      saveUninitialized: true,
    })
  );
  app.set("port", port);
  // Thiết lập thư mục tĩnh cho các tài nguyên công khai
  app.use(express.static(path.join(__dirname, "../public")));

  // Thiết lập template engine (nếu bạn sử dụng Handlebars)
  app.engine(
    ".hbs",
    handlebars.engine({
      extname: ".hbs",
      defaultLayout: false,
    })
  );
  app.set("view engine", ".hbs");
  app.set("views", path.join(__dirname, "../views"));
  console.log("__dirname: ", path.join(__dirname, "../views"));
};
