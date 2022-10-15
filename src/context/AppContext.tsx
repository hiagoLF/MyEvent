import React, {ReactNode, useContext, useState} from 'react';
import {createContext} from 'react';
import {deleteOnStorage, setOnStorage} from '../storage';

interface AppProviderProps {
  children: ReactNode;
}

interface AuthProps {
  token: string;
  user: {name: string};
}

interface AuthenticationContextProps {
  defineAuth: (auth: AuthProps) => void;
  auth?: AuthProps;
  removeAuth: () => Promise<void>;
}

const AppContext = createContext<AuthenticationContextProps>(
  {} as AuthenticationContextProps,
);

export const AppProvider: React.FC<AppProviderProps> = ({children}) => {
  const [auth, setAuth] = useState<AuthProps | undefined>(undefined);

  async function defineAuth(authData: AuthProps) {
    setAuth(authData);
    await setOnStorage('@MyEventToken', authData.token);
  }

  async function removeAuth() {
    await deleteOnStorage('@MyEventToken');
    await deleteOnStorage('@MyEventPurchaseData');
    await deleteOnStorage('@MyEventTransferData');
    setAuth(undefined);
  }

  return (
    <AppContext.Provider value={{defineAuth, auth, removeAuth}}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
