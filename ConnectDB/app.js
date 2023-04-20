const mongoose = require('mongoose')
const dotenv =  require('dotenv');
const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser');

const userRoutes = require('./routes/User')
const noteRoutes = require('./routes/Note');
const auth = require('./middleware/auth');

const app = express()
dotenv.config()

app.use(bodyParser.json())
app.use(cors())

app.use('/api/notes', auth, noteRoutes);
app.use('/api/users',userRoutes)

//-----------------------for not providing auth token-------------------------
app.use('/api/protected',auth,(req,resp)=>{
    resp.send(`Hi , ${req.user.name},you are authenticated`)
})

//------------------------for inalid url ---------------------------------------
app.use((req, res, next) => {
    const err = new Error('not found');
    err.status = 404;
    next(err);
});

//---------------------------when data does not match e.g email-------------------
app.use((err, req, res, next) => {
    const status = err.status || 500;
    res.status(status).json({ error: { message: err.message } });
});


mongoose.connect(process.env.MONGO_URL,()=>{
    console.log('connected to database')
});

app.listen(5000, () => console.log('Server running on port 5000'))