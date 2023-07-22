import { MongoClient, ServerApiVersion } from "mongodb";
import {
  BlockchainNet,
  BlockchainNetwork,
} from "@dfns/sdk/codegen/datamodel/Foundations";
import { DfnsApiClient } from "@dfns/sdk";
import { AsymmetricKeySigner } from "@dfns/sdk-keysigner";
import { useRouter } from "next/router";

const signer = new AsymmetricKeySigner({
  privateKey: process.env.DFNS_SERVICE_ACCOUNT_PRIVATE_KEY,
  credId: process.env.DFNS_SERVICE_ACCOUNT_CREDENTIAL_ID,
  appOrigin: process.env.DFNS_APPLICATION_ORIGIN,
});

const dfnsApi = new DfnsApiClient({
  appId: process.env.DFNS_APPLICATION_ID,
  authToken: process.env.DFNS_SERVICE_ACCOUNT_TOKEN,
  baseUrl: process.env.DFNS_API_BASE_URL,
  signer,
});

console.log(process.env.DFNS_SERVICE_ACCOUNT_PRIVATE_KEY);

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

connectToDatabase();

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

async function addUsernamePasswordAndWalletIds(
  client,
  username,
  password,
  walletIds
) {
  const collection = client.db("EmailWallet").collection("litemails");
  await collection.insertOne({ username, password, ...walletIds });
}

const handler = async (req, res) => {
  try {
    const { username, password } = req.body;
    const client = await connectToDatabase();

    let walletIds = await getWalletIds(client, username, password);
    if (walletIds) {
      res.status(200).json({
        message: "Username and password exist",
        walletIdEthereum: walletIds.walletIdEthereum,
        walletIdPolygon: walletIds.walletIdPolygon,
      });
    } else {
      // Check if the username exists but the password doesn't match
      const user = await client
        .db("EmailWallet")
        .collection("litemails")
        .findOne({ username });
      if (user) {
        res.status(400).json({ message: "Password incorrect" });
      } else {
        // Mint new Wallets
        const walletIdEthereum = await dfnsApi.wallets.createWallet({
          body: { network: "EthereumGoerli" },
        });
        const walletIdPolygon = await dfnsApi.wallets.createWallet({
          body: { network: "PolygonMumbai" },
        });

        walletIds = {
          walletIdEthereum: walletIdEthereum.id,
          walletIdPolygon: walletIdPolygon.id,
        };

        await addUsernamePasswordAndWalletIds(
          client,
          username,
          password,
          walletIds
        );
        res.status(200).json({
          message: "Username and password added",
          walletIdEthereum: walletIds.walletIdEthereum,
          walletIdPolygon: walletIds.walletIdPolygon,
        });
      }
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
