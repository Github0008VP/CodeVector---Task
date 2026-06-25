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

    const batchSize = 5000;   // instead of pushing items at one time, we are making batches

    let productNumber = 1;

    for(let i =1; i <= 40; i++) {

        const products = [];
        
        for (let i = 1; i <= batchSize; i++) {
          products.push({
            name: `Product ${productNumber}`,
            category: categories[Math.floor(Math.random() * categories.length)],
            price: parseInt(Math.random() * 1000),
          });

          productNumber++;
        }

        await Product.insertMany(products);
    }




    console.log("200000 products inserted");

    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};


seedProducts();