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
  const collection  = database.collection("learner");
  const learnersCursor = await collection.find({});
  const learners       = await learnersCursor.toArray();
  
  res.statusCode = 200;
  res.json(learners);
  res.end();
  client.close();
})
.post(async (req, res, next) => {
    await client.connect();
    const database    = client.db("driving_school");
    const collection  = database.collection("learner");
    const learnersCursor = await collection.insertOne(req.body);
  
    res.statusCode = 200;
    res.end();
    client.close();
});

router.route('/:id')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Accept', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
})
.get(async (req, res, next) => {
    await client.connect();
    const database    = client.db("driving_school");
    const collection  = database.collection("learner");
    const learnersCursor = await collection.find({});
    const learners       = await learnersCursor.toArray();

    const learner        = learners.filter(learnerObj => learnerObj._id == req.params.id)[0];
        
    res.statusCode = 200;
    res.json(learner);
    client.close();
   
})
.put(async (req, res, next) => {
    await client.connect();
    const database    = client.db("driving_school");
    const collection  = database.collection("learner");

    var   learnersCursor = await collection.find({});
    var   learners       = await learnersCursor.toArray();
    var   learner        = learners.filter(learnerObj => learnerObj._id == req.params.id)
          learnersCursor = await collection.updateOne(learner[0],{$set:req.body});

          res.statusCode = 200;
          res.end("Success");
          client.close();

    /*
    if(learnersCursor.modifiedCount == 0){
        res.statusCode = 500;
        res.end("Could not update :( ");
        client.close();
    }else{
        res.statusCode = 200;
        res.end("Success");
        client.close();
    } */
    
})
.delete(async (req, res, next) => {
    await client.connect();
    const database    = client.db("driving_school");
    const collection  = database.collection("learner");
    var   learnersCursor = await collection.find({});
    const learners       = await learnersCursor.toArray();
    const learner        = learners.filter(learnerObj => learnerObj._id == req.params.id)[0];
    try{
        const learnersCursor = await collection.deleteOne(learner);
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
