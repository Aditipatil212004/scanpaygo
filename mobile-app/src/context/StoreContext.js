import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getSelectedStore } from "../services/addressService";

const StoreContext = createContext(undefined);

export const StoreProvider = ({ children }) => {
  const [storeLoading, setStoreLoading] = useState(true);
  const [selectedStore, setSelectedStore] = useState(null);

  const fetchSelectedStore = async () => {
    try {
      setStoreLoading(true);

      // ✅ Load cached store
      const saved = await AsyncStorage.getItem("selectedStore");
      if (saved) {
        setSelectedStore(JSON.parse(saved));
      }

      // ✅ Fetch selected store from backend (optional)
      const res = await getSelectedStore();
      if (res?.ok) {
        setSelectedStore(res.selected || null);
        await AsyncStorage.setItem(
          "selectedStore",
          JSON.stringify(res.selected || null)
        );
      }
    } catch (e) {
      console.log("Store load error:", e);
    } finally {
      setStoreLoading(false);
    }
  };

  const setStore = async (store) => {
    try {
      setSelectedStore(store);
      await AsyncStorage.setItem("selectedStore", JSON.stringify(store));
    } catch (e) {
      console.log("Store save error:", e);
    }
  };

  const clearStore = async () => {
    try {
      setSelectedStore(null);
      await AsyncStorage.removeItem("selectedStore");
    } catch (e) {
      console.log("Clear store error:", e);
    }
  };

  useEffect(() => {
    fetchSelectedStore();
  }, []);

  return (
    <StoreContext.Provider
      value={{
        storeLoading,
        selectedStore,
        fetchSelectedStore,
        setStore,
        clearStore,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (ctx === undefined) {
    throw new Error("useStore must be used inside StoreProvider");
  }
  return ctx;
};
