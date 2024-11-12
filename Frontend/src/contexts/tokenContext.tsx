import React, { createContext, useContext, useState, ReactNode } from "react";

interface AccessTokenContextType {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
}

const AccessTokenContext = createContext<AccessTokenContextType | undefined>(
  undefined
);

export const useAccessToken = () => {
  const context = useContext(AccessTokenContext);
  if (!context) {
    throw new Error(
      "useAccessToken must be used within an AccessTokenProvider"
    );
  }
  return context;
};

export const AccessTokenProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  return (
    <AccessTokenContext.Provider value={{ accessToken, setAccessToken }}>
      {children}
    </AccessTokenContext.Provider>
  );
};
