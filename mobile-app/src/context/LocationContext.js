import React, { createContext, useContext, useState } from "react";

const LocationContext = createContext();

export function LocationProvider({ children }) {
  const [location, setLocation] = useState(null); // city / coords
  const [storeSelected, setStoreSelected] = useState(false);

  return (
    <LocationContext.Provider
      value={{
        location,
        setLocation,
        storeSelected,
        setStoreSelected,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export const useLocationCtx = () => useContext(LocationContext);
