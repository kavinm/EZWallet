import { MongoClient, ServerApiVersion } from "mongodb";

const mongoPass = process.env.NEXT_PUBLIC_MONGO_PASS;
const uri = `mongodb+srv://kavin1810:${mongoPass}@cluster0.fvj4tpc.mongodb.net/?retryWrites=true&w=majority`;

async function connectToDatabase() {
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
  }
  return client;
}

async function getWalletIds(client, username, password) {
  const collection = client.db("EmailWallet").collection("litemails");
  const user = await collection.findOne({ username, password });
  return user
    ? {
        walletIdEthereum: user.walletIdEthereum,
        walletIdPolygon: user.walletIdPolygon,
      }
    : null;
}

const handler = async (req, res) => {
  try {
    const { username, password } = req.query;
    const client = await connectToDatabase();

    let walletIds = await getWalletIds(client, username, password);
    if (walletIds) {
      res
        .status(200)
        .json({ message: "Username and password exist", ...walletIds });
    } else {
      res.status(400).json({ message: "Username or password incorrect" });
    }
    client.close();
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export default handler;
