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
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
})
.get(async (req, res, next) => {
  await client.connect();
  const database    = client.db("driving_school");
  const collection  = database.collection("user");
  const usersCursor = await collection.find({});
  const users       = await usersCursor.toArray();
  
  res.statusCode = 200;
  res.json(users);
  res.end();
  client.close();
})
.post(async (req, res, next) => {
    await client.connect();
    const database    = client.db("driving_school");
    const collection  = database.collection("user");
    const usersCursor = await collection.insertOne(req.body);
  
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
    const collection  = database.collection("user");
    const usersCursor = await collection.find({});
    const users       = await usersCursor.toArray();

    const user        = users.filter(userObj => userObj._id == req.params.id)[0];
        
    res.statusCode = 200;
    res.json(user);
    client.close();
   
})
.put(async (req, res, next) => {
    await client.connect();
    const database    = client.db("driving_school");
    const collection  = database.collection("user");

    var   usersCursor = await collection.find({});
    var   users       = await usersCursor.toArray();
    var   user        = users.filter(userObj => userObj._id == req.params.id)
          usersCursor = await collection.updateOne(user[0],{$set:req.body});

          res.statusCode = 200;
          res.end("Success");
          client.close();

    /*
    if(usersCursor.modifiedCount == 0){
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
    const collection  = database.collection("user");
    var   usersCursor = await collection.find({});
    const users       = await usersCursor.toArray();
    const user        = users.filter(userObj => userObj._id == req.params.id)[0];
    try{
        const usersCursor = await collection.deleteOne(user);
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
