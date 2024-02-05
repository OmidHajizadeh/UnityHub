import React, { useContext, useState } from "react";

const context = React.createContext<{
  defferedEvent: any | null;
  setDefferedEvent: React.Dispatch<React.SetStateAction<any | null>>;
}>({
  defferedEvent: null,
  setDefferedEvent: () => {},
});

const PWAContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [defferedEvent, setDefferedEvent] = useState<any | null>(null);
  return (
    <context.Provider
      value={{
        defferedEvent,
        setDefferedEvent,
      }}
    >
      {children}
    </context.Provider>
  );
};

export const usePWAContext = () => useContext(context);
export default PWAContextProvider;
