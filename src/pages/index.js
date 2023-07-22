import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import React, { useState, useEffect } from "react";

import { Input, Box, Heading, Button, VStack } from "@chakra-ui/react";

import { useRouter } from "next/router";

import mongoose from "mongoose";

const inter = Inter({ subsets: ["latin"] });

function Home() {
  const router = useRouter();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState(null);

  const handleInputChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLoginClick = async () => {
    try {
      const response = await fetch("/api/checkUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      if (data.walletIdEthereum && data.walletIdPolygon) {
        // Redirect the user to the WalletPage and pass the walletId and email as query parameters
        router.push({
          pathname: "/walletpage",
          query: {
            walletIdEthereum: data.walletIdEthereum,
            walletIdPolygon: data.walletIdPolygon,
            email: username,
          },
        });
      } else if (data.message === "Password incorrect") {
        // Handle incorrect password
        setError(data.message);
      } else if (data.message === "Username and password added") {
        // Handle new user registration
        router.push({
          pathname: "/walletpage",
          query: {
            walletIdEthereum: data.walletIdEthereum,
            walletIdPolygon: data.walletIdPolygon,
            email: username,
          },
        });
      }
    } catch (error) {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
    }
  };

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
          <Box textAlign="center" fontSize="xl">
            <VStack spacing={8} py={12}>
              <Heading as="h1" size="2xl" color="black">
                Login/Register
              </Heading>
              <Input
                placeholder="Enter your Email"
                size="lg"
                value={username}
                onChange={handleInputChange}
                backgroundColor="white"
                maxWidth="400px"
                color="black"
              />

              <Input
                type="password"
                placeholder="Enter your Password"
                size="lg"
                value={password}
                onChange={handlePasswordChange}
                backgroundColor="white"
                maxWidth="400px"
                color="black"
              />
              <Button colorScheme="blue" size="lg" onClick={handleLoginClick}>
                Login
              </Button>

              {error && <div>{error}</div>}
            </VStack>
          </Box>
        </div>
      </div>
    </div>
  );
}

export default Home;
