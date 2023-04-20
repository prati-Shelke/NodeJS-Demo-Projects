const mongoose = require('mongoose')
const express = require('express');
const userRoutes = require('./Routes/User')
const FeedRoutes = require('./Routes/Feed')
const bodyParser = require('body-parser');
const cors = require('cors')
const { MONGO_URL } = require('./config');

const path = require('path')

const app = express();
app.use(cors())
app.use(bodyParser.json())
app.set('view engine',"ejs")

app.use('/', userRoutes)
app.use('/',FeedRoutes)
app.use("/Images", express.static("Images"));

mongoose.connect(MONGO_URL,()=>{
    console.log('connected to database')
})

app.listen(5000,console.log('server running on port 5000'))