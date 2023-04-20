const express = require('express')
const path = require('path')

const app = express()
const publicPath = path.join(__dirname,'public')
app.use(express.static(publicPath)) // 1st way


app.get('/',(req,resp)=>{

    // resp.sendFile('./public/index.html',{root:__dirname}) // 2nd way
    resp.sendFile(path.join(__dirname,'public','index.html  '))
})

app.get('/about',(req,resp)=>{

    // console.log('request sent by client ====> ',req.query) //{name:'pratiksha'}
    // console.log('request sent by client ====> ',req.query.name)  
    // resp.send(`Hello ${req.query.name} this is home page`)
    resp.sendFile(`${publicPath}/about.html`)
})

// app.get('/about',(req,resp)=>{
//     resp.send('Hi this is about page')
// })



app.listen(5000)