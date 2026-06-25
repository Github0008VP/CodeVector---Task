require('dotenv').config()
const app = require("./src/app.js")

const connectDB = require('./src/config/db.js')

const PORT = process.env.PORT || 5000

const startServer = async () => {

    try {
        console.log("connecting.......")
        await connectDB();
    } catch (error) {
        console.log(error)
    }
    
    app.listen(PORT, () => {
        console.log("server is running")
    })

}

startServer();