const mongoose = require('mongoose')
const dotenv =  require('dotenv');
dotenv.config()


mongoose.connect(process.env.MONGO_URL,()=>{
    console.log('connected to database')
})