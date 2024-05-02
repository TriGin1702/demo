const axios = require("axios");
class Product {
  constructor(id, name, description, price, brand, image) {
    this._id = id;
    this._name = name;
    this._description = description;
    this._price = price;
    this._brand = brand;
    this._image = image;
  }

  get id() {
    return this._id;
  }

  set id(newId) {
    this._id = newId;
  }

  get name() {
    return this._name;
  }

  set name(newName) {
    this._name = newName;
  }

  get description() {
    return this._description;
  }

  set description(newDescription) {
    this._description = newDescription;
  }

  get price() {
    return this._price;
  }

  set price(newPrice) {
    this._price = newPrice;
  }

  get brand() {
    return this._brand;
  }

  set brand(newBrand) {
    this._brand = newBrand;
  }

  get image() {
    return this._image;
  }

  set image(newImage) {
    this._image = newImage;
  }

  async getALLProducts() {
    try {
      return await axios.get("http://localhost:3000/api/products");
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  }
}
module.exports = Product;
