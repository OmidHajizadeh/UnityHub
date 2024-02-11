import { BeforeInstallPromptEvent } from "@/types";
import React, { useContext, useState } from "react";

const context = React.createContext<{
  defferedEvent: BeforeInstallPromptEvent | null;
  setDefferedEvent: React.Dispatch<React.SetStateAction<any | null>>;
  PWAPromptAsked: string | null;
}>({
  defferedEvent: null,
  setDefferedEvent: () => {},
  PWAPromptAsked: null,
});

const PWAContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [defferedEvent, setDefferedEvent] =
    useState<BeforeInstallPromptEvent | null>(null);

  const PWAPromptAsked = localStorage.getItem("install-prompt");

  return (
    <context.Provider
      value={{
        defferedEvent,
        setDefferedEvent,
        PWAPromptAsked,
      }}
    >
      {children}
    </context.Provider>
  );
};

export const usePWAContext = () => useContext(context);
export default PWAContextProvider;
