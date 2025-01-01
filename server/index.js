const express = require('express');
const { mongoose } = require('mongoose');
const dotenv = require('dotenv');
const userRouter = require('./routes/user.route');
const authRouter = require('./routes/auth.route');
const cors = require('cors');
const cookieParser = require('cookie-parser');


const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
dotenv.config();

mongoose
    .connect(process.env.MONGO, { autoIndex: true })
    .then(()=>{
        console.log('Mongodb Connected');
    })
    .catch((e)=>{
        console.log(e)
    })



app.use('/api/user', userRouter);
app.use('/api/auth', authRouter)

app.use((err, req, res, next)=> {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message
    })
})





app.listen(4000, ()=>{
    console.log('Server is running on localhost: 4000');
})