/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {Provider as PaperProvider, Text} from 'react-native-paper';
import {QueryClient, QueryClientProvider} from 'react-query';
import {AppProvider} from './context/AppContext';
import {startServer} from './mock/api';
import {Screens} from './router/navigation';
import {LogBox} from 'react-native';
import {logsActived, mockMode} from '../config';

if (!logsActived) {
  LogBox.ignoreLogs(['Warning: ...']);
  LogBox.ignoreAllLogs();
}

const queryClient = new QueryClient();

const App = () => {
  const [display, setDisplay] = useState(!mockMode);

  useEffect(() => {
    if (mockMode) {
      prepareMockAndDisplayScreen();
    }
  }, []);

  async function prepareMockAndDisplayScreen() {
    startServer();
    await new Promise(res => setTimeout(() => res(true), 1000));
    setDisplay(true);
  }

  if (!display) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Gerando Mock...</Text>
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <PaperProvider>
          <Screens />
        </PaperProvider>
      </AppProvider>
    </QueryClientProvider>
  );
};

export default App;
