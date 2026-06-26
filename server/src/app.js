const express = require('express');
const productRoutes = require('./routes/product.routes.js')

const app = express();


app.get("/", (req, res) => {
    res.send("hi, server is live......")
})

app.use('/api/products', productRoutes)

module.exports = app