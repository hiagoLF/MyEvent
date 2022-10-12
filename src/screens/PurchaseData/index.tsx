/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View, ScrollView} from 'react-native';
import {Button, Card, Text, TextInput, Title} from 'react-native-paper';
import {AppHeader} from '../../components/AppHeader';

export const PurchaseData: React.FC = () => {
  const {goBack} = useNavigation();
  const {navigate} = useNavigation();

  return (
    <View style={{flex: 1}}>
      <AppHeader
        title="Dados da Compra"
        backAction
        onBackActionPress={() => goBack()}
      />

      <ScrollView
        keyboardShouldPersistTaps={true}
        contentContainerStyle={{padding: 10}}>
        <Card style={{marginBottom: 10}}>
          <Card.Title title="Compra" />
          <Card.Content>
            <Title>Evento UFBA</Title>
            <Text variant="titleMedium">R$ 200,00</Text>
          </Card.Content>
        </Card>
        <TextInput label="Nome" style={{marginBottom: 10}} />
        <TextInput label="Telefone" style={{marginBottom: 10}} />
        <TextInput label="Endereço" style={{marginBottom: 10}} />
        <TextInput label="Cidade" style={{marginBottom: 10}} />
        <TextInput label="Estado" style={{marginBottom: 10}} />
        <TextInput label="Cep" style={{marginBottom: 10}} />
        <TextInput label="Número do Cartão" style={{marginBottom: 10}} />
        <Button
          style={{marginBottom: 10}}
          icon="application-edit"
          mode="contained"
          onPress={() =>
            navigate('FinalizePurchase' as never, {id: 'rwerdfsd'} as never)
          }>
          Continuar
        </Button>
      </ScrollView>
    </View>
  );
};
