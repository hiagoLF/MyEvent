/* eslint-disable react-native/no-inline-styles */
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {AxiosError} from 'axios';
import React, {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {View, ScrollView, Alert} from 'react-native';
import {Button, Card, Text, TextInput, Title} from 'react-native-paper';
import {useMutation} from 'react-query';
import {AppHeader} from '../../components/AppHeader';
import {finalizePurchaseOnApi} from '../../services/api/buy';
import {setOnStorage} from '../../storage';
import {PurchaseValues} from '../PurchaseData';

export interface FinalizePurchaseProps {
  verification_code: string;
}

interface PurchaseParams {
  id: string;
  name: string;
  valor: number;
  reservationId: string;
}

interface RouteParams {
  purchaseValues: PurchaseValues;
  purchase: PurchaseParams;
}

type RootStackParamList = {
  Profile: RouteParams;
};

type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'Profile'>;

export const FinalizePurchase: React.FC = () => {
  const {goBack, reset} = useNavigation();
  const {params} = useRoute<ProfileScreenRouteProp>();
  const [creditCard, setCreditCard] = useState('');

  const {control, handleSubmit} = useForm<FinalizePurchaseProps>();

  const finalizePurchaseMutation = useMutation(finalizePurchaseOnApi, {
    onSuccess: handleFinalizePurchaseSuccess,
    onError: handleFinalizePurchaseError,
  });
  function handleFinalizePurchaseError(error: AxiosError) {
    console.log('Tá vindo aqui no erro??');
    Alert.alert('Erro', error.response?.data?.message || error.message);
  }

  async function handleFinalizePurchaseSuccess() {
    const {phone, cep, name, adress, city, state} = params.purchaseValues;

    await setOnStorage(
      '@MyEventPurchaseData',
      JSON.stringify({phone, cep, name, adress, city, state}),
    );

    await new Promise(res =>
      Alert.alert(
        'Sucesso',
        'Você acabou de comprar comprar um ingresso. Obrigado!',
        [
          {
            text: 'Continuar',
            onPress: () => res(true),
          },
        ],
      ),
    );

    goToPurchases();
  }

  function goToPurchases() {
    reset({
      routes: [
        {
          name: 'Purchases' as never,
          params: {},
        },
      ],
    });
  }

  useEffect(() => {
    if (params.purchaseValues.credit_card) {
      const lastDigits = params.purchaseValues.credit_card.split(' ')[3];
      setCreditCard(`**** **** **** ${lastDigits}`);
    }
  }, [params.purchaseValues]);

  function onSubmit(values: FinalizePurchaseProps) {
    finalizePurchaseMutation.mutate({
      purchaseValues: params.purchaseValues,
      reservationId: params.purchase.reservationId,
      card: values,
    });
  }

  return (
    <View style={{flex: 1}}>
      <AppHeader
        title="Finalizar Compra"
        backAction
        onBackActionPress={() => goBack()}
      />

      <ScrollView
        keyboardShouldPersistTaps="always"
        contentContainerStyle={{padding: 10}}>
        <Card style={{marginBottom: 10}}>
          <Card.Title title="Compra" />
          <Card.Content>
            <Title>{params.purchase.name}</Title>
            <Text variant="titleMedium">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format((params.purchase.valor as number) / 100)}
            </Text>
          </Card.Content>
          <Card.Content>
            <Title style={{marginTop: 20}}>Pagamento</Title>
            <Title>VISA</Title>
            <Text variant="titleMedium">{creditCard}</Text>
          </Card.Content>
        </Card>
        <Controller
          control={control}
          rules={{required: true, maxLength: 3, minLength: 3}}
          name="verification_code"
          render={({fieldState: {error}, field: {onChange}}) => (
            <TextInput
              error={!!error}
              onChangeText={onChange}
              keyboardType="numeric"
              label="Código Verificador"
              style={{marginBottom: 10}}
            />
          )}
        />
        <Button
          style={{marginBottom: 10}}
          icon="application-edit"
          mode="contained"
          onPress={handleSubmit(onSubmit)}>
          Finalizar
        </Button>
      </ScrollView>
    </View>
  );
};
