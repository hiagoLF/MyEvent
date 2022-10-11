import React from 'react';
import {Provider as PaperProvider} from 'react-native-paper';
import {Screens} from './screens';

const App = () => {
  return (
    <PaperProvider>
      <Screens />
    </PaperProvider>
  );
};

export default App;
