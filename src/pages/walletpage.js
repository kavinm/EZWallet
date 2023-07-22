import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";

const WalletPage = () => {
  const router = useRouter();
  const [walletEthereum, setWalletEthereum] = useState(null);
  const [walletPolygon, setWalletPolygon] = useState(null);

  useEffect(() => {
    const fetchWallets = async () => {
      const { walletIdEthereum, walletIdPolygon } = router.query;

      const responseEthereum = await fetch(
        `/api/getWallet?walletId=${walletIdEthereum}`
      );
      const responseTextEthereum = await responseEthereum.text();
      console.log(responseTextEthereum);
      const walletEthereum = JSON.parse(responseTextEthereum);

      const responsePolygon = await fetch(
        `/api/getWallet?walletId=${walletIdPolygon}`
      );
      const responseTextPolygon = await responsePolygon.text();
      console.log(responseTextPolygon);
      const walletPolygon = JSON.parse(responseTextPolygon);

      setWalletEthereum(walletEthereum);
      setWalletPolygon(walletPolygon);
    };

    if (router.query.walletIdEthereum && router.query.walletIdPolygon) {
      fetchWallets();
    }
  }, [router.query]);

  return (
    <div
      style={{
        background: "#4ED8B4",
        fontFamily: "Times New Roman",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}>
      <div
        style={{
          background: "#BFBFBF",
          boxShadow: "3px 3px 5px 1px rgba(0,0,0,0.75)",
          border: "1.4px solid white",
          padding: "4px",
          maxWidth: "800px",
          width: "100%",
          minHeight: "20px",
        }}>
        <div
          style={{
            width: "100%",
            background: "#01007A",
            height: "23px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: "white",
            padding: "0 10px",
            boxSizing: "border-box",
          }}>
          <div>Programs - EZWallet</div>
          <div>
            <button style={{ marginRight: "5px" }}>Minimize</button>
            <button style={{ marginRight: "5px" }}>Maximize</button>
            <button>Exit</button>
          </div>
        </div>
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-around",
            padding: "10px 0",
            boxSizing: "border-box",
          }}>
          <div>File</div>
          <div>Edit</div>
          <div>Search</div>
          <div>Help</div>
        </div>
        <div
          style={{
            height: "400px",
            width: "100%",
            background: "white",
            border: "1.2px solid black",
            overflow: "auto",
            padding: "5px",
            boxSizing: "border-box",
          }}>
          <Box textAlign="center" fontSize="xl" color="black">
            <h1>You are on the Wallet Page</h1>
            {walletEthereum && (
              <div>
                <h2>Ethereum Wallet</h2>
                <p>ID: {walletEthereum.id}</p>
                <p>Address: {walletEthereum.address}</p>
                <p>Chain: {walletEthereum.network}</p>
              </div>
            )}
            {walletPolygon && (
              <div>
                <h2>Polygon Wallet</h2>
                <p>ID: {walletPolygon.id}</p>
                <p>Address: {walletPolygon.address}</p>
                <p>Chain: {walletPolygon.network}</p>
              </div>
            )}
          </Box>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
