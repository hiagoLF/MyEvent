/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {Button, TextInput} from 'react-native-paper';
import {Card, Text} from 'react-native-paper';

export const Register: React.FC = () => {
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
            Registrar Conta
          </Text>

          <View style={{paddingVertical: 30}}>
            <TextInput label="Criar Login" style={{marginBottom: 10}} />
            <TextInput label="Criar Senha" style={{marginBottom: 10}} />
            <TextInput label="Repetir Senha" style={{marginBottom: 10}} />
          </View>

          <Button
            icon="login-variant"
            mode="contained"
            onPress={() => console.log('Login')}>
            Registrar
          </Button>

          <View style={{alignItems: 'center', marginTop: 20}}>
            <Text>Já tem uma conta?</Text>
            <Button
              compact
              mode="text"
              onPress={() => navigate('Login' as never)}>
              Faça Login
            </Button>
          </View>
        </Card>
      </View>
    </ScrollView>
  );
};
