import React from 'react';
import {Provider as PaperProvider} from 'react-native-paper';
import {QueryClient, QueryClientProvider} from 'react-query';
import {AppProvider} from './context/AppContext';
import {startServer} from './mock/api';
// import {startServer} from './mock/api';
import {Screens} from './router/navigation';

startServer();

const queryClient = new QueryClient();

const App = () => {
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
