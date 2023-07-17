import Head from 'next/head'
import { Inter } from 'next/font/google'
import Web3Modal from "web3modal";
import {ethers, providers} from "ethers";
import { useEffect, useState, useRef } from 'react';
import styles from '@/styles/Home.module.css'


export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const web3ModalRef = useRef();
  const [ens, setEns] = useState("")
  const [address, setAddress] = useState("")

  const setENSorAddress = async (address, web3Provider) => {
    var _ens = await web3Provider.lookupAddress(address);

    if (_ens) {
      setEns(_ens);
    } else {
      setAddress(address);
    }
  };

  const getProviderOrSigner = async (needSigner = false) => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 5) {
      window.alert("change network to Goerli");
      throw new Error("change network to Goerli");
    }
    const signer = web3Provider.getSigner();
    const address = await signer.getAddress();
    await setENSorAddress(address, web3Provider);
    return signer;
  };

  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
    } catch (error) {
      console.error(error)
    }
  }

  const renderButton = () => {
    if(walletConnected) {
      <div>Wallet connected.</div>
    } else {
      return (
        <button className={styles.button} onClick={connectWallet}>
          Connect your wallet
        </button>
      )
    }
  }

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
    }
  }, [walletConnected]);


  return (
    <>
      <Head>
        <title>ENS Dapp</title>
        <meta name="description" content="ens-dapp" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>
            Welcome to LearnWeb3 Punks {ens ? ens : address}!
          </h1>
          <div className={styles.description}>
            It&#39;s an NFT collection for LearnWeb3 Punks.
          </div>
          {renderButton()}
        </div>
        <div>
          <img className={styles.image} src='./learnweb3punks.png' alt="" />
        </div>
      </div>

      <footer className={styles.footer}>
        Made with &#10084; by LearnWeb3 Punks
      </footer>
      
    </>
  )
}
