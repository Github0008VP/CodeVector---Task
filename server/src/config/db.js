const mongoose = require("mongoose");


const connectDB = async () => {

    // console.log(process.env.MONGO_URI);   just checking if able to get string from env file
    try {
        const db = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB is Connected`);
    } catch (err) {
        console.error(`Connection Failed: ${err.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;