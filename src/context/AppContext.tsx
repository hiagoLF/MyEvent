import React, {ReactNode, useContext, useState} from 'react';
import {createContext} from 'react';
import {setOnStorage} from '../storage';

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

  return (
    <AppContext.Provider value={{defineAuth, auth}}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
