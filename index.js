const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// chocolateManagement
// 1BLcFq3kUkjm91kE

const uri = `mongodb+srv://${process.env.DATA_USER}:${process.env.DATA_PASS}@cluster0.tbmejyb.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const chocolateDB = client.db("chocolateDB");
    const chocolateData = chocolateDB.collection("chocolateData");

    app.get("/data", async (req, res) => {
      const cursor = chocolateData.find();
      const results = await cursor.toArray();
      res.send(results);
    });

    app.post("/newadd", async (req, res) => {
      const addChoco = req.body;
      console.log(addChoco);
      const result = await chocolateData.insertOne(addChoco);
      res.send(result);
    });

    app.get("/data/:id", async (req, res) => {
      const result = await chocolateData.findOne({
        _id: new ObjectId(req.params.id),
      });
      res.send(result);
    });

    app.put("/update/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateChoco = req.body;
      // console.log(updateChoco)
      const chocolate = {
        $set: {
          name: updateChoco.name,
          country: updateChoco.country,
          category: updateChoco.category,
        },
      };
      const result = await chocolateData.updateOne(filter, chocolate, options);
      res.send(result);
    });

    app.delete("/data/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await chocolateData.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`The port is running on ${port}`);
});
