import React from 'react';
import {Provider as PaperProvider} from 'react-native-paper';
import {Screens} from './router/navigation';

const App = () => {
  return (
    <PaperProvider>
      <Screens />
    </PaperProvider>
  );
};

export default App;
