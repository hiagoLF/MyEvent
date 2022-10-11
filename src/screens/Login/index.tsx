/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {Button, TextInput} from 'react-native-paper';
import {Card, Text} from 'react-native-paper';

export const Login: React.FC = () => {
  const {navigate} = useNavigation();

  return (
    <ScrollView contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}>
      <View
        style={{
          flex: 1,
          width: '100%',
          justifyContent: 'center',
          padding: 10,
        }}>
        <Card style={{justifyContent: 'center', padding: 10}}>
          <Text variant="titleLarge" style={{textAlign: 'center'}}>
            Login
          </Text>

          <View style={{marginVertical: 30}}>
            <TextInput label="Login" style={{marginBottom: 10}} />
            <TextInput label="Senha" />
          </View>

          <Button
            icon="login-variant"
            mode="contained"
            onPress={() => console.log('Login')}>
            Login
          </Button>

          <View style={{alignItems: 'center', marginTop: 20}}>
            <Text>Não possuiu conta?</Text>
            <Button mode="text" onPress={() => navigate('Register' as never)}>
              Registrar
            </Button>
          </View>
        </Card>
      </View>
    </ScrollView>
  );
};
