import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {Provider as PaperProvider, Text} from 'react-native-paper';
import {QueryClient, QueryClientProvider} from 'react-query';
import {AppProvider} from './context/AppContext';
import {startServer} from './mock/api';
import {Screens} from './router/navigation';

const queryClient = new QueryClient();

const App = () => {
  const [display, setDisplay] = useState(false);

  useEffect(() => {
    displayScreen();
    setDisplay(true);
  }, []);

  async function displayScreen() {
    startServer();
    await new Promise(res => setTimeout(() => res(true), 500));
    setDisplay(true);
  }

  if (!display) {
    return (
      <View>
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
