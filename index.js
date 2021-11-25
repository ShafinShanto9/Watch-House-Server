const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8oki3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const port = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

client.connect(err => {
    const ProductCollection = client.db("watch").collection("product");
    const ReviewCollection = client.db("watch").collection("review")
    const OrderCollection = client.db("watch").collection("order")
    const usersCollection = client.db("watch").collection("users")

    // Add Product
    app.post("/addservice", async (req, res) => {
        console.log(req.body);
        const result = await ProductCollection.insertOne(req.body);
        console.log(result);
      });

      //  Add Order 
      app.post("/order" , async(req ,res) => {
        console.log(req.body)
        const result = await OrderCollection.insertOne(req.body)
        console.log(result)
      })
    //   Add Review
    app.post("/addreview", async (req , res) => {
        const result = await ReviewCollection.insertOne(req.body)
        console.log(result)
    })
    // add User Information
    app.post("/addUserInfo", async (req, res) => {
      const result = await usersCollection.insertOne(req.body);
      res.send(result);
      console.log(result);
    });

    //   get products
  app.get("/allproduct", async (req, res) => {
    const result = await ProductCollection.find({}).toArray();
    res.send(result);
  })
  //  Get All Orders
  app.get("/myorder", async (req, res) => {
    const result = await OrderCollection.find({}).toArray()
    res.send(result)
  })
    // Get Review
    app.get("/allreview" , async (req ,res) => {
        const result = await ReviewCollection.find({}).toArray();
        res.send(result)
    })
    // Get My order with email
    app.get("/myorder/:email", async (req, res) => {
      const result = await OrderCollection.find({
        email: req.params.email,
      }).toArray();
      res.send(result);
    });

   //  make admin
      app.put("/makeAdmin", async (req, res) => {
        const filter = { email: req.body.email };
        console.log(filter)
        const result = await usersCollection.find(filter).toArray();
        if (result) {
          const updateRole = await usersCollection.updateOne(filter, {
            $set: { role: "admin" },
          });
          console.log(updateRole);
        }
      });
      // find Admin Role
      app.get("/checkAdmin/:email", async (req, res) => {
        const result = await usersCollection
          .find({ email: req.params.email })
          .toArray();
        console.log(result);
        res.send(result);
      });
    // Delete Orders
    app.delete("/deleteEvent/:id", async (req, res) => {
      console.log(req.params.id);
      const result = await OrderCollection.deleteOne({
        _id: ObjectId(req.params.id),
      });
      res.send(result);
    });
    // Delete Product
    app.delete("/deleteProduct/:id", async (req, res) => {
      console.log(req.params.id);
      const result = await ProductCollection.deleteOne({
        _id: ObjectId(req.params.id),
      });
      res.send(result);
    });






    // client.close();
  })
    
  app.listen(process.env.PORT || port)