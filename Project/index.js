const libexpress = require("express")
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors')
const app = libexpress();
app.use(cors());
app.use(libexpress.json());

const url = 'mongodb://127.0.0.1:27017';
const dbName = 'my_data';

//Show all the cars
app.get("/cars", async(req,res)=>{

    try{
        const client = new MongoClient(url)
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('cars')
        const result = await collection.find().toArray()
        console.log(result);
        res.status(200).json(result)
    }
    catch(e)
    {
        console.log(e);
        res.status(500).json({error:e})
    }

})

//find a specific car
app.get("/cars/:id", async(req,res)=>{

    const id = req.params.id;

    try{
        const client = new MongoClient(url)
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('cars')
        const result = await collection.findOne({_id:new ObjectId(id)})
        console.log(result);
        res.status(200).json(result)
    }
    catch(e)
    {
        console.log(e);
        res.status(500).json({error:e})
    }

})

//Add a New Car
app.post("/cars", async (req,res)=>{
    if(req.body.car_name && req.body.price && req.body.modle){

    try{
        const connection = await new MongoClient(url).connect();
        const db = connection.db(dbName)
        const collection = db.collection('cars')
        const result = await collection.insertOne(req.body);
        console.log(result);
        res.status(200).json(result)
    }
    catch(e){
        console.log(e);
    }
}
else{
    res.status(400).json({error:"Missing arams"})
}

})
//put
app.put("/cars/:id", async(req,res)=>{

    const id = req.params.id;

    try{
        const client = new MongoClient(url)
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('cars')
        const result = await collection.updateOne({_id:new ObjectId(id)},{ $set: req.body });
        console.log(result);
        res.status(200).json(result)
    }
    catch(e)
    {
        console.log(e);
        res.status(500).json({error:e})
    }

})
//patch
app.patch("/cars/:id", async(req,res)=>{

    const id = req.params.id;

    try{
        const client = new MongoClient(url)
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('cars')
        const result = await collection.updateOne({_id:new ObjectId(id)},{ $set: req.body });
        console.log(result);
        res.status(200).json(result)
    }
    catch(e)
    {
        console.log(e);
        res.status(500).json({error:e})
    }

})

//Delete a Car
app.delete("/cars/:id", async(req,res)=>{

    const id = req.params.id;

    try{
        const client = new MongoClient(url)
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('cars')
        const result = await collection.deleteOne({_id:new ObjectId(id)});
        console.log(result);
        res.status(200).json(result)
    }
    catch(e)
    {
        console.log(e);
        res.status(500).json({error:e})
    }

})


app.listen(8000,()=>{console.log("i am listening on port 8000");})