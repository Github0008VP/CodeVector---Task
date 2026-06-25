require('dotenv').config()
const app = require("./src/app.js")

const connectDB = require('./src/config/db.js')

const startServer = async () => {

    try {
        console.log("connecting.......")
        await connectDB();
    } catch (error) {
        console.log(error)
    }
    
    app.listen(5000, () => {
        console.log("server is running")
    })

}

startServer();