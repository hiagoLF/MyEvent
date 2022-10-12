/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View, ScrollView} from 'react-native';
import {Button, Card, Text, TextInput, Title} from 'react-native-paper';
import {AppHeader} from '../../components/AppHeader';

export const FinalizePurchase: React.FC = () => {
  const {goBack} = useNavigation();
  const {navigate} = useNavigation();

  return (
    <View style={{flex: 1}}>
      <AppHeader
        title="Finalizar Compra"
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
          <Card.Content>
            <Title>Pagamento</Title>
            <Title>VISA</Title>
            <Text variant="titleMedium">----.----.----.4243</Text>
          </Card.Content>
        </Card>

        <TextInput label="Código Verificador" style={{marginBottom: 10}} />
        <Button
          style={{marginBottom: 10}}
          icon="application-edit"
          mode="contained"
          onPress={() =>
            navigate('FinalizePurchase' as never, {id: 'rwerdfsd'} as never)
          }>
          Finalizar
        </Button>
      </ScrollView>
    </View>
  );
};
