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
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Accept', 'application/json');
    next();
})
.get(async (req, res, next) => {
  await client.connect();
  const database    = client.db("driving_school");
  const collection  = database.collection("instructor");
  const instructorsCursor = await collection.find({});
  const instructors       = await instructorsCursor.toArray();
  
  res.statusCode = 200;
  res.json(instructors);
  res.end();
  client.close();
})
.post(async (req, res, next) => {
    await client.connect();
    const database    = client.db("driving_school");
    const collection  = database.collection("instructor");
    const instructorsCursor = await collection.insertOne(req.body);
  
    res.statusCode = 200;
    res.end();
    client.close();
});

router.route('/:id')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Accept', 'application/json');
    next();
})
.get(async (req, res, next) => {
    await client.connect();
    const database    = client.db("driving_school");
    const collection  = database.collection("instructor");
    const instructorsCursor = await collection.find({});
    const instructors       = await instructorsCursor.toArray();

    const instructor        = instructors.filter(instructorObj => instructorObj._id == req.params.id)[0];
        
    res.statusCode = 200;
    res.json(instructor);
    client.close();
   
})
.put(async (req, res, next) => {
    await client.connect();
    const database    = client.db("driving_school");
    const collection  = database.collection("instructor");

    var   instructorsCursor = await collection.find({});
    var   instructors       = await instructorsCursor.toArray();
    var   instructor        = instructors.filter(instructorObj => instructorObj._id == req.params.id)
          instructorsCursor = await collection.updateOne(instructor[0],{$set:req.body});

          res.statusCode = 200;
          res.end("Success");
          client.close();
    
})
.delete(async (req, res, next) => {
    await client.connect();
    const database    = client.db("driving_school");
    const collection  = database.collection("instructor");
    var   instructorsCursor = await collection.find({});
    const instructors       = await instructorsCursor.toArray();
    const instructor        = instructors.filter(instructorObj => instructorObj._id == req.params.id)[0];
    try{
        const instructorsCursor = await collection.deleteOne(instructor);
        res.statusCode = 200;
        res.end();
    }catch(e){
        console.log(e);
        res.statusCode = 500;
        res.end("Could not delete");
    }
    client.close();
  
    
});



module.exports = router;
