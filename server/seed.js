console.log(parseInt(Math.random() * 1000));

console.log(Math.floor(Math.random() * 100000));
require('dotenv').config()

const mongoose = require("mongoose");
const Product = require("./src/models/product.model.js");

mongoose.connect(process.env.MONGO_URI);

const categories = ["MobilePhone", "Laptops", "Desktop", "Watches", "Rings"];

const seedProducts = async () => {
  try {
    await Product.deleteMany();

    const products = [];

    for (let i = 1; i <= 200000; i++) {
      products.push({
        name: `Product ${i}`,
        category: categories[Math.floor(Math.random() * categories.length)],
        price: parseInt(Math.random() * 1000),
      });
    }

    await Product.insertMany(products);

    console.log("200000 products inserted");

    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};


seedProducts();