import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const StoreContext = createContext(undefined);

export const StoreProvider = ({ children }) => {
  const [storeLoading, setStoreLoading] = useState(true);

  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedStore, setSelectedStore] = useState(null);

  const fetchSavedData = async () => {
    try {
      setStoreLoading(true);

      const savedCity = await AsyncStorage.getItem("selectedCity");
      const savedLocation = await AsyncStorage.getItem("selectedLocation");
      const savedStore = await AsyncStorage.getItem("selectedStore");

      if (savedCity) setSelectedCity(JSON.parse(savedCity));
      if (savedLocation) setSelectedLocation(JSON.parse(savedLocation));
      if (savedStore) setSelectedStore(JSON.parse(savedStore));

    } catch (e) {
      console.log("Store load error:", e);
    } finally {
      setStoreLoading(false);
    }
  };

  const setCity = async (city) => {
    try {
      setSelectedCity(city);
      await AsyncStorage.setItem("selectedCity", JSON.stringify(city));
    } catch (e) {
      console.log("City save error:", e);
    }
  };

  const setLocation = async (location) => {
    try {
      setSelectedLocation(location);
      await AsyncStorage.setItem("selectedLocation", JSON.stringify(location));
    } catch (e) {
      console.log("Location save error:", e);
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

  const clearAll = async () => {
    try {
      setSelectedCity(null);
      setSelectedLocation(null);
      setSelectedStore(null);

      await AsyncStorage.multiRemove([
        "selectedCity",
        "selectedLocation",
        "selectedStore",
      ]);
    } catch (e) {
      console.log("Clear error:", e);
    }
  };

  useEffect(() => {
    fetchSavedData();
  }, []);

  return (
    <StoreContext.Provider
      value={{
        storeLoading,

        selectedCity,
        selectedLocation,
        selectedStore,

        setCity,
        setLocation,
        setStore,
        clearAll,
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
