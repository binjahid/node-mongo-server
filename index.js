const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 4000;
const ObjectId = require("mongodb").ObjectId;
app.use(cors());
app.use(express.json());

const { MongoClient } = require("mongodb");
// const { ObjectId } = require("bson");
const uri =
  "mongodb+srv://myfirstdb:op1ssy00BqcAP6xv@cluster0.0mdbb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// app.get("/users", (req, res) => {
//   res.send("i am from a get response");
// });
async function run() {
  try {
    await client.connect();
    const database = client.db("tracelMaster");
    const usersCollecion = database.collection("usersCollection");
    // get api
    app.get("/users", async (req, res) => {
      const cursor = usersCollecion.find({});
      // console.log(cursor);
      const users = await cursor.toArray();
      console.log(users);
      res.send(users);
    });
    //post api
    app.post("/users", async (req, res) => {
      console.log("post hitted", req.body);
      const newUser = req.body;
      const result = await usersCollecion.insertOne(newUser);
      console.log("got new user ", req.body);
      console.log("added new user ", result);
      res.json(result);
    });
    //UPDATE API
    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const query = { _id: ObjectId(id) };
      const result = await usersCollecion.findOne(query);
      console.log(result);
      res.send(result);
    });
    //DELETE Api
    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await usersCollecion.deleteOne(query);
      // console.log(result);
      res.send(result);
    });

    // console.log(`A document was inserted with the _id: ${result.insertedId}`);
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log("i am listening form port ", port);
});
