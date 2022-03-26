var express = require('express');
var router = express.Router();
var dotenv = require("dotenv");
    dotenv.config()

const MongoClient = require("mongodb").MongoClient;
const client      = new MongoClient(process.env.ATLAS_URI, 
                                    {  
                                        useNewUrlParser: true,  
                                        useUnifiedTopology: true  
                                    });

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
  const collection  = database.collection("car");
  const carsCursor  = await collection.find({});
  const cars        = await carsCursor.toArray();
  
  res.statusCode = 200;
  res.json(cars);
  res.end();
  client.close();
})
.post(async (req, res, next) => {
    await client.connect();
    const database    = client.db("driving_school");
    const collection  = database.collection("car");
    const carsCursor  = await collection.insertOne(req.body);
  
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
    const collection  = database.collection("car");
    const carsCursor  = await collection.find({});
    const cars        = await carsCursor.toArray();

    const car        = cars.filter(carObj => carObj._id == req.params.id)[0];
        
    res.statusCode = 200;
    res.json(car);
    client.close();
   
})
.put(async (req, res, next) => {
    await client.connect();
    const database    = client.db("driving_school");
    const collection  = database.collection("car");

    var   carsCursor = await collection.find({});
    var   cars       = await carsCursor.toArray();
    var   car        = cars.filter(carObj => carObj._id == req.params.id)
          carsCursor = await collection.updateOne(car[0],{$set:req.body});

          res.statusCode = 200;
          res.end("Success");
          client.close();
    
})
.delete(async (req, res, next) => {
    await client.connect();
    const database    = client.db("driving_school");
    const collection  = database.collection("car");
    var   carsCursor = await collection.find({});
    const cars       = await carsCursor.toArray();
    const car        = cars.filter(carObj => carObj._id == req.params.id)[0];
    try{
        const carsCursor = await collection.deleteOne(car);
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
