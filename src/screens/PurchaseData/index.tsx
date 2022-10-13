/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {View, ScrollView} from 'react-native';
import {useMaskedInputProps} from 'react-native-mask-input';
import {Button, Card, Text, TextInput, Title} from 'react-native-paper';
import {AppHeader} from '../../components/AppHeader';
import {cepMask, creditCardMask, phoneMask} from '../../services/masks';
import {getFromStorage} from '../../storage';

interface RouteParams {
  id?: string;
  name?: string;
  valor?: number;
  reservationId: number;
}

type RootStackParamList = {
  Profile: RouteParams;
};

type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'Profile'>;

export interface PurchaseValues {
  phone: string;
  credit_card: string;
  cep: string;
  name: string;
  adress: string;
  city: string;
  state: string;
}

export const PurchaseData: React.FC = () => {
  const {goBack, navigate} = useNavigation();
  const {params} = useRoute<ProfileScreenRouteProp>();

  const {setValue, register, formState, watch, handleSubmit, control} =
    useForm<PurchaseValues>();
  const phoneValue = watch('phone');
  const creditCardValue = watch('credit_card');
  const cepValue = watch('cep');

  const phoneMaskProps = useMaskedInputProps({
    value: phoneValue,
    onChangeText: phone => setValue('phone', phone, {shouldValidate: true}),
    mask: phoneMask,
  });

  const cardMaskProps = useMaskedInputProps({
    value: creditCardValue,
    onChangeText: card => setValue('credit_card', card, {shouldValidate: true}),
    mask: creditCardMask,
  });

  const cepMaskProps = useMaskedInputProps({
    value: cepValue,
    onChangeText: cep => setValue('cep', cep, {shouldValidate: true}),
    mask: cepMask,
  });

  useEffect(() => {
    register('phone', {
      required: true,
    });
    register('credit_card', {
      required: true,
    });
    register('cep', {
      required: true,
    });
  }, []);

  function onSubmit(purchaseValues: PurchaseValues) {
    navigate(
      'FinalizePurchase' as never,
      {purchaseValues, purchase: params} as never,
    );
  }

  async function getDefaultDataIfExists() {
    const defaultValuesFound = await getFromStorage('@MyEventPurchaseData');
    if (defaultValuesFound) {
      const parsed = JSON.parse(defaultValuesFound);
      setValue('name', parsed.name);
      setValue('city', parsed.city);
      setValue('adress', parsed.adress);
      setValue('state', parsed.state);
      setValue('phone', parsed.phone);
      setValue('cep', parsed.cep);
    }
  }

  useEffect(() => {
    getDefaultDataIfExists();
  }, []);

  return (
    <View style={{flex: 1}}>
      <AppHeader
        title="Dados da Compra"
        backAction
        onBackActionPress={() => goBack()}
      />

      <ScrollView
        keyboardShouldPersistTaps="always"
        contentContainerStyle={{padding: 10}}>
        <Card style={{marginBottom: 10}}>
          <Card.Title title="Compra" />
          <Card.Content>
            <Title>{params.name}</Title>
            <Text variant="titleMedium">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(params.valor as number)}
            </Text>
          </Card.Content>
        </Card>
        <Controller
          control={control}
          rules={{required: true}}
          name="name"
          render={({fieldState: {error}, field: {onChange, value}}) => (
            <TextInput
              error={!!error}
              onChangeText={onChange}
              value={value}
              label="Nome"
              style={{marginBottom: 10}}
            />
          )}
        />
        <TextInput
          label="Telefone"
          style={{marginBottom: 10}}
          error={!!formState.errors.phone}
          {...phoneMaskProps}
        />
        <Controller
          control={control}
          rules={{required: true}}
          name="adress"
          render={({fieldState: {error}, field: {onChange, value}}) => (
            <TextInput
              error={!!error}
              onChangeText={onChange}
              value={value}
              label="Endereço"
              style={{marginBottom: 10}}
            />
          )}
        />

        <Controller
          control={control}
          rules={{required: true}}
          name="city"
          render={({fieldState: {error}, field: {onChange, value}}) => (
            <TextInput
              error={!!error}
              onChangeText={onChange}
              value={value}
              label="Cidade"
              style={{marginBottom: 10}}
            />
          )}
        />

        <Controller
          control={control}
          rules={{required: true}}
          name="state"
          render={({fieldState: {error}, field: {onChange, value}}) => (
            <TextInput
              error={!!error}
              onChangeText={onChange}
              value={value}
              label="Estado"
              style={{marginBottom: 10}}
            />
          )}
        />
        <TextInput
          label="Cep"
          style={{marginBottom: 10}}
          error={!!formState.errors.cep}
          {...cepMaskProps}
        />
        <TextInput
          label="Número do Cartão"
          style={{marginBottom: 10}}
          error={!!formState.errors.credit_card}
          {...cardMaskProps}
        />
        <Button
          style={{marginBottom: 10}}
          icon="application-edit"
          mode="contained"
          disabled={Object.keys(formState.errors).length > 0}
          onPress={handleSubmit(onSubmit)}>
          Continuar
        </Button>
      </ScrollView>
    </View>
  );
};
