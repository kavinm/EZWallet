import { DfnsApiClient } from "@dfns/sdk";
import { AsymmetricKeySigner } from "@dfns/sdk-keysigner";
import { ethers } from "ethers";

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

export default async function handler(req, res) {
  const { address, amount, walletId } = req.body;
  const amountInWei = ethers.utils.parseEther(amount).toString();

  const wallet = await dfnsApi.wallets.transferAsset({
    walletId,
    body: {
      kind: "Native",
      to: address,
      amount: amountInWei,
    },
  });
  res.send(wallet);
}
