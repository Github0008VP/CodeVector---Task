const Product = require('../models/product.model.js');

const getProducts = async (req, res) => {

    try {

        const limit = parseInt(req.query.limit) || 20;
        const cursor = req.query.cursor;
        const category = req.query.category;

        const query = {};

        if(cursor) {
            query.id = {$lt: cursor};
        }

        if(category) {
            query.category = category;
        }

        const products = await Product.find(query)
            .sort({createdAt: -1})
            .limit(limit)

        let nextCursor = null;

        if(products.length > 0) {
            nextCursor = products[products.length - 1]._id;
        }

        res.status(200).json({
            success: true,
            products,
            nextCursor
        })
        
    } catch (err) {
        res.status(500).json({
            message: 'Internal Server Error!!!!',
            error: err.message
        })
    }

}


module.exports = getProducts