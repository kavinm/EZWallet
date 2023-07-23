import { DfnsApiClient } from "@dfns/sdk";
import { AsymmetricKeySigner } from "@dfns/sdk-keysigner";

export default async function handler(req, res) {
  const { walletId } = req.query;

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

  const walletAssets = await dfnsApi.wallets.getWalletAssets({ walletId });

  res.status(200).json(walletAssets);
}
