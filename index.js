const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = 3000;
const app = express();

// middlewares

app.use(express.json());
app.use(cors());

app.get("/", (req,res)=>{
    res.send("this is homepage");
})

app.listen(port, ()=>{
    console.log("server is running on port : ", port);
})