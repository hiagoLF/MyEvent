import React, {ReactNode, useContext} from 'react';
import {createContext} from 'react';

interface AppProviderProps {
  children: ReactNode;
}

const AppContext = createContext({});

export const AppProvider: React.FC<AppProviderProps> = ({children}) => {
  return <AppContext.Provider value={{}}>{children}</AppContext.Provider>;
};

export const useApp = () => useContext(AppContext);
