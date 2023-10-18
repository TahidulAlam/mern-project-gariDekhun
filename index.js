// tahidcse
// fhv6jjhoPYpURnxu
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rclqpat.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const slider_image = client.db("brand").collection("slider_image");
    const brand_details = client.db("brand").collection("brand details");
    const addproducts = client.db("brand").collection("addproducts");
    app.get("/home/slider", async (req, res) => {
      const cursur = slider_image.find();
      const result = await cursur.toArray();
      res.send(result);
    });
    app.get("/home", async (req, res) => {
      const cursur = brand_details.find();
      const result = await cursur.toArray();
      res.send(result);
    });
    app.get("/home/:id", async (req, res) => {
      const id = req.params.id;
      const query = {
        _id: new ObjectId(id),
      };
      const result = await brand_details.findOne(query);
      res.send(result);
    });
    app.post("/addproducts", async (req, res) => {
      const product = req.body;
      const result = await addproducts.insertOne(product);
      console.log(result);
      res.send(result);
    });
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Gari Dekhun Server is running");
});

app.listen(port, () => {
  console.log(`Gari Dekhun Server is running on port: ${port}`);
});
