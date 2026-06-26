const express = require('express');
const productRoutes = require('./routes/product.routes.js')
const cors = require('cors')

const app = express();

app.use(cors({
    origin: "https://code-vector-task-one.vercel.app"
}))

app.get("/", (req, res) => {
    res.send("hi, server is live......")
})

app.use('/api/products', productRoutes)

module.exports = app