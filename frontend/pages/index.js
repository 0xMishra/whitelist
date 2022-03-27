import Head from "next/head";
import styles from "../styles/Home.module.css";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { WHITELIST_ADDRESS, WHITELIST_ABI } from "../constants/constants";
import { useState, useEffect } from "react";

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [joinedWhitelist, setJoinedWhitelist] = useState(false);
  const [loading, setLoading] = useState(true);
  const [numberOfWhitelited, setNumberOfWhiteListed] = useState(0);

  const connectWallet = async () => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    let currentAddress = await signer.getAddress();
    const whitelistContract = new ethers.Contract(
      WHITELIST_ADDRESS,
      WHITELIST_ABI,
      signer
    );
    setWalletConnected(true);

    let isJoinedWhitelist = await whitelistContract.whitelistAddresses(
      currentAddress
    );
    setJoinedWhitelist(isJoinedWhitelist);

    let numberOfWhitelisters =
      await whitelistContract.numberOfWhitelistedAddresses();
    setNumberOfWhiteListed(numberOfWhitelisters.toNumber());
    setLoading(false);
  };

  const addressToWhitelist = async () => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const whitelistContract = new ethers.Contract(
      WHITELIST_ADDRESS,
      WHITELIST_ABI,
      signer
    );
    const addTxn = await whitelistContract.addToWhitelist();
    await addTxn.wait();
    setJoinedWhitelist(true);
    document.location.reload();
    let numberOfWhitelisters =
      await whitelistContract.numberOfWhitelistedAddresses();
    setNumberOfWhiteListed(numberOfWhitelisters.toNumber());
  };

  useEffect(() => {
    connectWallet();
  }, []);
  const renderButton = () => {
    if (walletConnected) {
      if (joinedWhitelist) {
        return (
          <div className={styles.description}>
            Thanks for joining the Whitelist!
          </div>
        );
      } else if (loading) {
        return <button className={styles.button}>Loading...</button>;
      } else {
        return (
          <button onClick={addressToWhitelist} className={styles.button}>
            Join the Whitelist
          </button>
        );
      }
    } else {
      return (
        <button onClick={connectWallet} className={styles.button}>
          Connect your wallet
        </button>
      );
    }
  };

  return (
    <div>
      <Head>
        <title>Whitelist Dapp</title>
        <meta name="description" content="Whitelist-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Welcome to Crypto Devs!</h1>
          <div className={styles.description}>
            Its an NFT collection for developers in Crypto.
          </div>
          <div className={styles.description}>
            {numberOfWhitelited} have already joined the Whitelist
          </div>
          {renderButton()}
        </div>
        <div>
          <img
            className={styles.image}
            src="https://raw.githubusercontent.com/LearnWeb3DAO/Whitelist-Dapp/c37ac59a1e72e176010643638995b9f7ed492e5a/my-app/public/crypto-devs.svg"
          />
        </div>
      </div>
    </div>
  );
}
