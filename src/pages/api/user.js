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

export default async (req, res) => {
  if (req.method === "GET") {
    const { walletIdEthereum } = req.query;
    const client = await connectToDatabase();

    let user = await client
      .db("EmailWallet")
      .collection("litemails")
      .findOne({ walletIdEthereum });

    if (user) {
      res.status(200).json({
        message: "User found",
        walletIdEthereum: user.walletIdEthereum,
        walletIdPolygon: user.walletIdPolygon,
        svgBinary: user.svgBinary,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
    client.close();
  } else {
    // Handle any other HTTP method
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
