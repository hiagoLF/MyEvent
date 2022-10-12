/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {Button, Card, Text, TextInput, Title} from 'react-native-paper';
import {AppHeader} from '../../components/AppHeader';

export const Transfer: React.FC = () => {
  const {goBack, navigate} = useNavigation();

  return (
    <View style={{flex: 1}}>
      <AppHeader title="Vendas" backAction onBackActionPress={() => goBack()} />

      <ScrollView contentContainerStyle={{padding: 10}}>
        <Card style={{marginBottom: 30}}>
          <Card.Content>
            <Title>Disponível</Title>
            <Text>R$ 460,00</Text>
          </Card.Content>
        </Card>

        <TextInput label="Valor" style={{marginBottom: 10}} />
        <TextInput label="Número do Banco" style={{marginBottom: 10}} />
        <TextInput label="Conta" style={{marginBottom: 10}} />

        <Button
          style={{marginBottom: 10}}
          icon="cash-fast"
          mode="contained"
          onPress={() => navigate('Transfer' as never)}>
          Transferência
        </Button>
      </ScrollView>
    </View>
  );
};
