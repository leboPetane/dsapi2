var express = require('express');
var router = express.Router();
var dotenv = require("dotenv");
    dotenv.config()

const MongoClient = require("mongodb").MongoClient;
const client      = new MongoClient(process.env.ATLAS_URI, { useNewUrlParser: true, useUnifiedTopology: true });

router.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Accept', 'application/json');
    next();
})
.get(async (req, res, next) => {
  await client.connect();
  const database    = client.db("driving_school");
  const collection  = database.collection("lesson");
  const lessonCursor = await collection.find({});
  const lessons      = await lessonCursor.toArray();
  
  res.statusCode = 200;
  res.json(lessons);
  res.end();
  client.close();
})
.post(async (req, res, next) => {
    await client.connect();
    const database    = client.db("driving_school");
    const collection  = database.collection("lesson");
    const lessonCursor = await collection.insertOne(req.body);
  
    res.statusCode = 200;
    res.end();
    client.close();
});

router.route('/:id')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Accept', 'application/json');
    next();
})
.get(async (req, res, next) => {
    await client.connect();
    const database     = client.db("driving_school");
    const collection   = database.collection("lesson");
    const lessonCursor = await collection.find({});
    const lessons      = await lessonCursor.toArray();

    const lesson       = lessons.filter(lessonObj => lessonObj._id == req.params.id)[0];
        
    res.statusCode = 200;
    res.json(lesson);
    client.close();
   
})
.put(async (req, res, next) => {
    await client.connect();
    const database    = client.db("driving_school");
    const collection  = database.collection("lesson");

    var   lessonCursor = await collection.find({});
    var   lessons       = await lessonCursor.toArray();
    var   lesson        = lessons.filter(lessonObj => lessonObj._id == req.params.id)
          lessonCursor = await collection.updateOne(lesson[0],{$set:req.body});

          res.statusCode = 200;
          res.end("Success");
          client.close();
    
})
.delete(async (req, res, next) => {
    await client.connect();
    const database     = client.db("driving_school");
    const collection   = database.collection("lesson");
    var   lessonCursor = await collection.find({});
    const lessons      = await lessonCursor.toArray();
    const lesson       = lessons.filter(lessonObj => lessonObj._id == req.params.id)[0];
    try{
        const lessonCursor = await collection.deleteOne(lesson);
        res.statusCode = 200;
        res.end();
    }catch(e){
        //console.log(e);
        res.statusCode = 500;
        res.end("Could not delete");
    }
    client.close();
  
    
});



module.exports = router;
