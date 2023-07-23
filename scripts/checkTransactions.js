const {
  BlockchainNet,
  BlockchainNetwork,
} = require("@dfns/sdk/codegen/datamodel/Foundations");

const { DfnsApiClient } = require("@dfns/sdk");
const { AsymmetricKeySigner } = require("@dfns/sdk-keysigner");
const main = async () => {
  const signer = new AsymmetricKeySigner({
    privateKey: process.env.DFNS_SERVICE_ACCOUNT_PRIVATE_KEY,
    credId: process.env.DFNS_SERVICE_ACCOUNT_CREDENTIAL_ID,
    appOrigin: process.env.DFNS_APPLICATION_ORIGIN,
  });
  console.log(signer);

  const dfnsApi = new DfnsApiClient({
    appId: process.env.DFNS_APPLICATION_ID,
    authToken: process.env.DFNS_SERVICE_ACCOUNT_TOKEN,
    baseUrl: process.env.DFNS_API_BASE_URL,
    signer,
  });
  console.log(dfnsApi);
  const walletId = "wa-45f4r-ap17n-9diou57ueefcsih1";

  const listedTransactions = await dfnsApi.wallets.listTransactions({
    walletId,
  });

  console.log(listedTransactions);
};

main();
