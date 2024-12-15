const express = require('express');
const { mongoose } = require('mongoose');
const dotenv = require('dotenv');


const app = express();
dotenv.config();



mongoose
    .connect(process.env.MONGO)
    .then(()=>{
        console.log('Mongodb Connected');
    })
    .catch((e)=>{
        console.log(e)
    })

app.get('/', (req, res)=>{
    res.json({message: process.env.Hrishikesh});
})

app.listen(4000, ()=>{
    console.log('Server is running on localhost: 4000');
})