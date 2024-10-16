import { MongoClient } from "mongodb";
import { uri } from "./secret";

const client = new MongoClient(uri, {

});

async function run() {
  try {
    let connection = await client.connect();
    await client.db("admin").command({ ping: 1 });

    let db = connection.db("syga");
    let collection = db.collection("algorithms");
    let results = await collection.find({})
      .limit(50)
      .toArray();
    return results;

  }
  finally {
    await client.close();
  }

}

async function getAlgorithm(identifier: string | number) {
  if (typeof identifier == "number") {
    throw new Error("Algorithm retrieval by id not implemented yet");
  }
  try {
    let connection = await client.connect();
    await client.db("admin").command({ ping: 1 });

    let db = connection.db("syga");
    let collection = db.collection("algorithms");
    let query = { name: identifier };
    let result = await collection.findOne(query);
    return result;
  }
  finally {
    await client.close();
  }
}

export { getAlgorithm };
