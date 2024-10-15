import { MongoClient } from "mongodb";
import { uri } from "./secret";

const client = new MongoClient(uri, {

});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  }
  finally {
    await client.close();
  }

}

export { run };
