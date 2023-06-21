const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const cors=require('cors');
const session  = require('express-session');
const passport=require("passport");
const LocalStrategy=require("passport-local").Strategy;
const passportLocalMongoose = require("passport-local-mongoose");
const flash = require("express-flash");
const { ObjectId } = require("mongodb");
const { string } = require("prop-types");
const QRCode = require('qrcode');
const fs = require('fs');

const app=express();


app.set('view engine','ejs');

app.use(cors({credentials:true,origin:'http://localhost:3000'}));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin","http://localhost:3000"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  app.use(express.json());

  app.use(bodyParser.json());

  app.use(bodyParser.urlencoded({
    extended: true
  }));

mongoose.connect("mongodb+srv://praveenb:Technothlon@getsganga.pgyia.mongodb.net/userd",{useNewUrlParser:true});

const data = new mongoose.Schema([{username:String},
{place:String},
{mobile:String},
{doctor:String},
{disease:String},
]);

const ndata = new mongoose.Schema([
  {username:String},
  {qrcodeimage:String}
])

data.plugin(passportLocalMongoose);

const Prap = new mongoose.model('Prap',data);

const Drap = new mongoose.model('Drap',ndata);

app.post("/upload",function(req,res)
{

  const savePersonAndGenerateQRCode = async (personData) => {
    try {
      // Create a new instance of the Prap schema
      const person = new Prap(personData);
  
      // Save the person in the database
const savedPerson = await person.save();

const sid = savedPerson._id.toString()

const qrCodeData = "localhost:3001/hello/" + savedPerson._id.toString();

QRCode.toDataURL(qrCodeData)
  .then((qrCodeImage) => {

     const savekaro = new Drap({
      username:sid,
      qrcodeimage:qrCodeImage
     });
     savekaro.save();
  })
  .then(() => {
    res.status(200).send(sid);
  })
  .catch((error) => {
     res.status(400).send("unsuccessful");
  });

    } catch (error) {
      res.status(400).send("unsuccessful");
    }
  };


    const persondata = {
        username :req.body.name,
        place:req.body.place,
        doctor:req.body.doctor,
        mobile:req.body.mobile,
        disease:req.body.disease
    };

    savePersonAndGenerateQRCode(persondata);



        
});


app.post("/find",function(req,res){
  console.log(req.body);

  Drap.find({ username: req.body.id })
  .then((matchingData) => {

    const imgBase64 = matchingData[0].qrcodeimage.toString("base64");

    //console.log("Hi");

     res.status(200).send(imgBase64);
  })
  .catch((error) => {
    res.status(400).send("unsuccesful");
  });



});

app.get("/hello/:data",function(req,res){

const id = req.params.data;

console.log(id);

const objectId = new mongoose.Types.ObjectId(id);

Prap.find({ _id: objectId })
  .then((matchingData) => {

    res.render("give",{data : matchingData[0]});
    //res.render("give",matchingData);
     
  })
  .catch((error) => {
    res.send("error");
  });

});

app.listen(3001, () => {
  console.log(`Server listening on ${3001}`);
});