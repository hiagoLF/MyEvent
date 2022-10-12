/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {Button, Card, Text, Title} from 'react-native-paper';
import {AppHeader} from '../../components/AppHeader';

export const Sales: React.FC = () => {
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

          <Card.Content>
            <Title>Total em Vendas</Title>
            <Text>R$ 2.650,00</Text>
          </Card.Content>
        </Card>

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
