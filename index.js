const express = require('express');
const bodyParser = require('body-parser');

require('dotenv').config()

//test welke host je gebruikt, local of VPS
console.log(process.env.BASE_URI)

const mongoose = require("mongoose");
mongoose.set('strictQuery', false);
const mongoDB = "mongodb://127.0.0.1/songs";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });


// // Get the default connectio
const db = mongoose.connection;
//
// // Bind connection to error event (to gasdet notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));

const app = express();

const musicRouter = require("./routers/musicRouter");

app.use(bodyParser.urlencoded({extended:true}));

app.use(bodyParser.json({type: 'application/json'}));



app.use('/songs/', musicRouter);


//let the app listen to port 8000
app.listen(8000,() =>{
   console.log('im working now')
})