const libexpress = require("express");
const { MongoClient, ObjectId } = require("mongodb");

const app = libexpress();
app.use(libexpress.json());

const MongoDBURL = "mongodb://127.0.0.1:27017";
const dbName = "onlineShoppingApp";

const productsCollection = 'product';

app.get("/all", async (req, res) => {
    try {
        const collection = await new MongoClient(MongoDBURL).connect();
        const db = collection.db(dbName);
        const data = db.collection(productsCollection);
        const result = await data.find().sort({ name: 1 }).toArray();
        res.status(200).json(result);
    } catch (e) {
        console.log(e);
    }
});

app.patch("/update/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const collection = await new MongoClient(MongoDBURL).connect();
        const db = collection.db(dbName);
        const data = db.collection(productsCollection);
        const result = await data.updateOne({_id: new ObjectId(id)},{ $set: req.body })
        res.status(200).json(result);
    } catch (e) {
        console.log(e);
    }
});

app.delete("/delete/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const collection = await new MongoClient(MongoDBURL).connect();
        const db = collection.db(dbName);
        const data = db.collection(productsCollection);
        const result = await data.deleteOne({_id: new ObjectId(id)})
        res.status(200).json(result);
    } catch (e) {
        console.log(e);
    }
});

app.listen("3000", () => {
    console.log("server started on port 3000");
});
