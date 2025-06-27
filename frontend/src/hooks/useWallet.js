'use client'

import { ethers } from "ethers";
import { useEffect, useState } from "react";

export default function useWallet() {
    const [currentAccount, setCurrentAccount] = useState(null);

    const checkIfWalletIsConnected = async() => {
        if(!window.ethereum) return alert("Please install metamask!");

        try{
            const accounts = window.ethereum.request({
                method: 'eth_accounts'
            });

            if(accounts.length > 0) {
                setCurrentAccount(accounts[0]);
            }else{
                console.log("No accounts found");
            }

        }catch(error) {
            console.error("Error checking wallet connection", error);
        }
    }

    const connectWallet = async() => {
        if(!window.ethereum) return alert("Please install metamask!");

        try{
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });

            if(accounts.length > 0) {
                setCurrentAccount(accounts[0]);
            }else{
                console.log("No accounts found");
            }
        }catch(error) {
            console.error(error);
        }
    }

    useEffect(() => {
        checkIfWalletIsConnected();

        const handleAccountChange = (accounts) => {
            if(accounts.length > 0) {
                setCurrentAccount(accounts[0]);
            }else{
                setCurrentAccount('');
            }
        }

        if(window.ethereum) {
            window.ethereum.on('accountsChanged', handleAccountChange);
        }
        return() => {
            window.ethereum.off('accountsChanged', handleAccountChange);
        }
    },[])

    return {currentAccount, connectWallet}
}