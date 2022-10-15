/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {View} from 'react-native';
import {RefreshControl, ScrollView} from 'react-native-gesture-handler';
import {Button, Card, Text, Title} from 'react-native-paper';
import {useMutation} from 'react-query';
import {AppHeader} from '../../components/AppHeader';
import {getMySailsOnAPi} from '../../services/api/sails';

export interface SailsResponse {
  sales: number;
  available: number;
}

export const Sales: React.FC = () => {
  const {navigate} = useNavigation();

  const salesMutation = useMutation(getMySailsOnAPi);

  useEffect(() => {
    salesMutation.mutate();
  }, []);

  return (
    <View style={{flex: 1}}>
      <AppHeader
        title="Vendas"
        backAction
        onBackActionPress={() => navigate('Home' as never)}
      />

      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={salesMutation.isLoading}
            onRefresh={() => salesMutation.mutate()}
          />
        }
        contentContainerStyle={{padding: 10}}>
        {!!salesMutation.data && (
          <>
            <Card style={{marginBottom: 30}}>
              <Card.Content>
                <Title>Disponível</Title>
                <Text>
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(salesMutation.data.data.available / 100)}
                </Text>
              </Card.Content>

              <Card.Content>
                <Title>Total em Vendas</Title>
                <Text>
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(salesMutation.data.data.sales / 100)}
                </Text>
              </Card.Content>
            </Card>

            <Button
              style={{marginBottom: 10}}
              icon="cash-fast"
              mode="contained"
              onPress={() => navigate('Transfer' as never)}>
              Transferência
            </Button>
          </>
        )}
      </ScrollView>
    </View>
  );
};
