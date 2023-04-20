const express = require('express')
const app = express()
const route = express.Router() // when there are multiple pages

const reqFilter = (req,resp,next) =>{
    if(!req.query.age)
    {
        resp.send('Please provide age')
    }
    else if(req.query.age<18)
    {
        resp.send('You can not access this page')
    }
    else
    {
        next()
    }
}

// app.use(reqFilter) -----------------------when apply to all routes 
route.use(reqFilter)

app.get('/',(req,resp)=>{
    resp.send('Welcome to home page')
})

app.get('/about',reqFilter ,(req,resp)=>{ // when want to apply one or more than one route
    resp.send('Welcome to users page')
})

route.get('/user',(req,resp)=>{
    resp.send('Welcome to user page')
})

app.use('/',route)
app.listen(5000)