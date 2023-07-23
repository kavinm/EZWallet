import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { formatUnits } from "ethers/lib/utils";
import {
  Box,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  VStack,
  HStack,
  Divider,
} from "@chakra-ui/react";
import { ethers } from "ethers";

const pageStyle = {
  background: "#4ED8B4",
  fontFamily: "Times New Roman",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
};

const containerStyle = {
  background: "#BFBFBF",
  boxShadow: "3px 3px 5px 1px rgba(0,0,0,0.75)",
  border: "1.4px solid white",
  padding: "4px",
  maxWidth: "800px",
  width: "100%",
  minHeight: "20px",
};

const headerStyle = {
  width: "100%",
  background: "#01007A",
  height: "23px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  color: "white",
  padding: "0 10px",
  boxSizing: "border-box",
};

const navStyle = {
  width: "100%",
  display: "flex",
  justifyContent: "space-around",
  padding: "10px 0",
  boxSizing: "border-box",
};

const contentStyle = {
  height: "400px",
  width: "100%",
  background: "white",
  border: "1.2px solid black",
  overflow: "auto",
  padding: "5px",
  boxSizing: "border-box",
};

const Noun = ({ svgBinary }) => (
  <div>
    <h2>Your Noun</h2>
    <div dangerouslySetInnerHTML={{ __html: svgBinary }} />
  </div>
);

const PolygonAssets = ({ assets, address }) => (
  <div>
    <h2>Polygon Assets</h2>
    {assets.map((asset) => (
      <div key={asset.symbol}>
        <p>Symbol: {asset.symbol}</p>
        <p>Balance: {formatUnits(asset.balance, asset.decimals)}</p>
        
      </div>
    ))}
    <p>To Deposit Polygon Assets: {address}</p>
  </div>
);

const EthereumAssets = ({ assets, address }) => (
  <div>
    <h2>Ethereum Assets</h2>
    {assets.map((asset) => (
      <div key={asset.symbol}>
        <p>Symbol: {asset.symbol}</p>
        <p>Balance: {formatUnits(asset.balance, asset.decimals)}</p>
        
      </div>
    ))}
    <p>To Deposit Ethereum Assets: {address}</p>
  </div>
);

const WalletPage = () => {
  const router = useRouter();

  const [walletEthereum, setWalletEthereum] = useState(null);
  const [walletPolygon, setWalletPolygon] = useState(null);
  const [svgBinary, setSvgBinary] = useState(null);

  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchWallets = async () => {
      const { walletIdEthereum, walletIdPolygon } = router.query;

      const responseEthereum = await fetch(
        `/api/getWallet?walletId=${walletIdEthereum}`
      );
      const walletEthereum = await responseEthereum.json();

      const responsePolygon = await fetch(
        `/api/getWallet?walletId=${walletIdPolygon}`
      );
      const walletPolygon = await responsePolygon.json();

      const responseSvgBinary = await fetch(
        `/api/user?walletIdEthereum=${walletIdEthereum}`
      );
      const user = await responseSvgBinary.json();

      setWalletEthereum(walletEthereum);
      setWalletPolygon(walletPolygon);
      setSvgBinary(user.svgBinary);
    };

    if (router.query.walletIdEthereum && router.query.walletIdPolygon) {
      fetchWallets();
    }
  }, [router.query]);

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <div style={headerStyle}>
          <div>Programs - EZWallet</div>
          <div>
            <button style={{ marginRight: "5px" }}>Minimize</button>
            <button style={{ marginRight: "5px" }}>Maximize</button>
            <button>Exit</button>
          </div>
        </div>

        <div style={navStyle}>
          <div>File</div>
          <div>Edit</div>
          <div>Search</div>
          <div>Help</div>
        </div>

        <div style={contentStyle}>
          {svgBinary && (
            <VStack spacing={4} align="center">
              <Noun svgBinary={svgBinary} />
              <Divider />
              <PolygonAssets assets={walletPolygon.assets.assets} address={walletPolygon.address} />
              <Divider />
              <EthereumAssets assets={walletEthereum.assets.assets} address={walletEthereum.address} />
            </VStack>
          )}

          <Button onClick={onOpen}>Send Zeta</Button>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent style={containerStyle}>
          <ModalHeader style={headerStyle}>Send Zeta</ModalHeader>

          <ModalCloseButton />

          <ModalBody style={{ background: "white", color: "black" }}>
            <Input
              placeholder="Enter address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              _placeholder={{ color: "gray.500" }}
            />
            <Input
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              _placeholder={{ color: "gray.500" }}
            />
          </ModalBody>

          <ModalFooter style={{ background: "white", color: "black" }}>
            <Button
              color="black"
              onClick={async () => {
                const ethereumId = walletEthereum.id;
                const response = await fetch("/api/sendZetaOnGoerli", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    address: "0x7fd072FaEeB75ef5e1B0A4443b80539eF48Ab9f5",
                    amount,
                    walletId: ethereumId,
                  }),
                });
                if (!response.ok) {
                  console.error(await response.json());
                  return;
                }
                const data = await response.json();
                console.log(data);
                const response2 = await fetch(
                  "/api/crossChainZetaGoerliToMumbai",
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      address: "0x7fd072FaEeB75ef5e1B0A4443b80539eF48Ab9f5",
                      amount,
                      walletId: ethereumId,
                    }),
                  }
                );
                if (!response2.ok) {
                  console.error(await response.json());
                  return;
                }
                const data2 = await response2.json();
                console.log(data2);
                onClose();
              }}>
              Send Zeta to Mumbai
            </Button>
            <Button
              color="black"
              onClick={async () => {
                const polygonId = walletPolygon.id;
                const response = await fetch("/api/sendZetaOnMumbai", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    address: "0x7fd072FaEeB75ef5e1B0A4443b80539eF48Ab9f5",
                    amount,
                    walletId: polygonId,
                  }),
                });
                if (!response.ok) {
                  console.error(await response.json());
                  return;
                }
                const data = await response.json();
                console.log(data);
                //cross chain
                const response2 = await fetch(
                  "/api/crossChainZetaMumbaiToGoerli",
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      address: "0x7fd072FaEeB75ef5e1B0A4443b80539eF48Ab9f5",
                      amount,
                    }),
                  }
                );
                if (!response2.ok) {
                  console.error(await response2.json());
                  return;
                }
                const data2 = await response2.json();
                console.log(data2);
                onClose();
              }}>
              Send Zeta to Goerli
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default WalletPage;
