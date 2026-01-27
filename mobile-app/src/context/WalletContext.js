import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const WalletContext = createContext(undefined);

const WALLET_BAL_KEY = "walletBalance";
const WALLET_TXN_KEY = "walletTransactions";

export const WalletProvider = ({ children }) => {
  const [walletLoading, setWalletLoading] = useState(true);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);

  // ✅ Load wallet from storage
  const loadWallet = async () => {
    try {
      setWalletLoading(true);

      const savedBalance = await AsyncStorage.getItem(WALLET_BAL_KEY);
      const savedTxns = await AsyncStorage.getItem(WALLET_TXN_KEY);

      setBalance(savedBalance ? Number(savedBalance) : 0);
      setTransactions(savedTxns ? JSON.parse(savedTxns) : []);
    } catch (e) {
      console.log("Wallet load error:", e);
    } finally {
      setWalletLoading(false);
    }
  };

  useEffect(() => {
    loadWallet();
  }, []);

  // ✅ Save helper
  const persistWallet = async (newBal, newTxns) => {
    await AsyncStorage.setItem(WALLET_BAL_KEY, String(newBal));
    await AsyncStorage.setItem(WALLET_TXN_KEY, JSON.stringify(newTxns));
  };

  // ✅ Add money
  const addMoney = async (amount) => {
    const amt = Number(amount);
    if (!amt || amt <= 0) return { ok: false, message: "Invalid amount" };

    const newBalance = balance + amt;

    const txn = {
      id: String(Date.now()),
      type: "credit",
      title: "Added money",
      amount: amt,
      date: new Date().toISOString(),
    };

    const newTxns = [txn, ...transactions];

    setBalance(newBalance);
    setTransactions(newTxns);
    await persistWallet(newBalance, newTxns);

    return { ok: true };
  };

  // ✅ Pay from wallet (deduct)
  const payFromWallet = async (amount, metaTitle = "Paid at store") => {
    const amt = Number(amount);
    if (!amt || amt <= 0) return { ok: false, message: "Invalid amount" };

    if (balance < amt) {
      return { ok: false, message: "Insufficient wallet balance" };
    }

    const newBalance = balance - amt;

    const txn = {
      id: String(Date.now()),
      type: "debit",
      title: metaTitle,
      amount: amt,
      date: new Date().toISOString(),
    };

    const newTxns = [txn, ...transactions];

    setBalance(newBalance);
    setTransactions(newTxns);
    await persistWallet(newBalance, newTxns);

    return { ok: true };
  };

  const clearWallet = async () => {
    setBalance(0);
    setTransactions([]);
    await persistWallet(0, []);
  };

  const value = useMemo(
    () => ({
      walletLoading,
      balance,
      transactions,
      loadWallet,
      addMoney,
      payFromWallet,
      clearWallet,
    }),
    [walletLoading, balance, transactions]
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};

export const useWallet = () => {
  const ctx = useContext(WalletContext);
  if (ctx === undefined) throw new Error("useWallet must be used inside WalletProvider");
  return ctx;
};
