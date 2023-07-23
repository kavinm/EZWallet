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
  console.log("This is the address " + address);
  console.log("This is the amount" + amount);

  const abi = [
    {
      inputs: [
        {
          internalType: "address",
          name: "connectorAddress_",
          type: "address",
        },
        {
          internalType: "address",
          name: "zetaToken_",
          type: "address",
        },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      inputs: [],
      name: "ChainIdAlreadyEnabled",
      type: "error",
    },
    {
      inputs: [],
      name: "ChainIdNotAvailable",
      type: "error",
    },
    {
      inputs: [],
      name: "ErrorTransferringZeta",
      type: "error",
    },
    {
      inputs: [],
      name: "InvalidAddress",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "caller",
          type: "address",
        },
      ],
      name: "InvalidCaller",
      type: "error",
    },
    {
      inputs: [],
      name: "InvalidDestinationChainId",
      type: "error",
    },
    {
      inputs: [],
      name: "InvalidZetaMessageCall",
      type: "error",
    },
    {
      inputs: [],
      name: "InvalidZetaRevertCall",
      type: "error",
    },
    {
      inputs: [],
      name: "InvalidZetaValueAndGas",
      type: "error",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "previousOwner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "OwnershipTransferStarted",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "previousOwner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "OwnershipTransferred",
      type: "event",
    },
    {
      inputs: [],
      name: "acceptOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "destinationChainId",
          type: "uint256",
        },
      ],
      name: "addAvailableChainId",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "availableChainIds",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "connector",
      outputs: [
        {
          internalType: "contract ZetaConnector",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "interactorsByChainId",
      outputs: [
        {
          internalType: "bytes",
          name: "",
          type: "bytes",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "owner",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "pendingOwner",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "destinationChainId",
          type: "uint256",
        },
      ],
      name: "removeAvailableChainId",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "renounceOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "destinationChainId",
          type: "uint256",
        },
        {
          internalType: "bytes",
          name: "destinationAddress",
          type: "bytes",
        },
        {
          internalType: "uint256",
          name: "zetaValueAndGas",
          type: "uint256",
        },
      ],
      name: "send",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "destinationChainId",
          type: "uint256",
        },
        {
          internalType: "bytes",
          name: "contractAddress",
          type: "bytes",
        },
      ],
      name: "setInteractorByChainId",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "transferOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "zetaToken",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ];
  const zetaInterface = new ethers.utils.Interface(abi);
  const amountInWei = ethers.utils.parseEther(amount).toString();

  const functionName = "send";
  const args = [
    "80001", // destination chain id
    address, // destination Address
    amountInWei, // zetaValueAndGas
  ];

  const encodedFunctionData = zetaInterface.encodeFunctionData(
    functionName,
    args
  );

  console.log(walletId);
  const wallet = await dfnsApi.wallets.broadcastTransaction({
    walletId,
    body: {
      kind: "Evm",
      to: "0x2619FA50d8B22916a89da252420ECf16704700f0",
      data: encodedFunctionData,
    },
  });
  res.send(wallet);
}
