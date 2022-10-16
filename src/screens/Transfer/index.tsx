/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import {AxiosError} from 'axios';
import React, {useEffect} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {Alert, View} from 'react-native';
import {RefreshControl, ScrollView} from 'react-native-gesture-handler';
import {Button, Card, Text, TextInput, Title} from 'react-native-paper';
import {useMutation} from 'react-query';
import {AppHeader} from '../../components/AppHeader';
import {getMySailsOnAPi, transferResquest} from '../../services/api/sails';
import {getFromStorage, setOnStorage} from '../../storage';

interface FormValues {
  valor: string;
  bankNumber: string;
  account: string;
}

export const Transfer: React.FC = () => {
  const {goBack, reset} = useNavigation();

  const salesMutation = useMutation(getMySailsOnAPi);

  useEffect(() => {
    salesMutation.mutate();
  }, []);

  const transferMutation = useMutation(transferResquest, {
    onSuccess: handleTranferSucces,
    onError: handleTransferError,
  });

  const {
    control,
    setValue,
    formState,
    register,
    watch,
    handleSubmit,
    getValues,
  } = useForm<FormValues>();

  useEffect(() => {
    if (salesMutation.isSuccess) {
      register('valor', {
        setValueAs: value => {
          return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(Number(value.replace(/[^0-9]/g, '')) / 100);
        },
        required: true,
        validate: vv => {
          return (
            (salesMutation.data?.data.available || 0) >=
            Number(vv.replace(/[^0-9]/g, ''))
          );
        },
      });
      defineDefaultValues();
    }
  }, [salesMutation.isSuccess]);

  async function defineDefaultValues() {
    const defValues = await getFromStorage('@MyEventTransferData');
    if (!defValues) {
      return;
    }
    const defaultValues = JSON.parse(defValues) as FormValues;
    setValue('account', defaultValues.account);
    setValue('bankNumber', defaultValues.bankNumber);
  }

  const valor = watch('valor');

  function handleTranferSucces() {
    setOnStorage('@MyEventTransferData', JSON.stringify(getValues()));

    Alert.alert('Sucesso', 'Transferência realizada com sucesso!', [
      {text: 'Continuar', onPress: goToSales},
    ]);
  }

  function handleTransferError(error: AxiosError) {
    Alert.alert('Erro', error.response?.data.message || error.message);
  }

  function goToSales() {
    reset({
      routes: [
        {
          name: 'Sales' as never,
        },
      ],
    });
  }

  async function onSubmit(values: FormValues) {
    const confirmed = await new Promise(res =>
      Alert.alert(
        'Transferência',
        `Você está transferindo ${values.valor} para a conta ${values.account} do banco ${values.bankNumber}`,
        [
          {text: 'Cancelar', onPress: () => res(false)},
          {text: 'Confirmar', onPress: () => res(true)},
        ],
      ),
    );

    if (confirmed) {
      transferMutation.mutate({
        valor: Number(values.valor.replace(/[^0-9]/g, '')),
        bankNumber: values.bankNumber,
        account: values.account,
      });
    }
  }

  return (
    <View style={{flex: 1}}>
      <AppHeader
        title="Transferir"
        backAction
        onBackActionPress={() => goBack()}
      />

      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={salesMutation.isLoading}
            onRefresh={() => salesMutation.mutate()}
          />
        }
        keyboardShouldPersistTaps="always"
        contentContainerStyle={{padding: 10}}>
        {salesMutation.data && (
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
            </Card>

            <TextInput
              label="Valor"
              style={{marginBottom: 10}}
              value={valor}
              error={!!formState.errors.valor}
              onChangeText={vv => setValue('valor', vv, {shouldValidate: true})}
            />

            <Controller
              name="bankNumber"
              control={control}
              rules={{required: true}}
              render={({fieldState: {error}, field: {onChange, value}}) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  error={!!error}
                  label="Número do Banco"
                  style={{marginBottom: 10}}
                />
              )}
            />

            <Controller
              name="account"
              control={control}
              rules={{required: true}}
              render={({fieldState: {error}, field: {onChange, value}}) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  error={!!error}
                  label="Conta"
                  style={{marginBottom: 10}}
                />
              )}
            />

            <Button
              style={{marginBottom: 10}}
              icon="cash-fast"
              mode="contained"
              disabled={
                Object.keys(formState.errors).length > 0 ||
                transferMutation.isLoading
              }
              loading={transferMutation.isLoading}
              onPress={handleSubmit(onSubmit)}>
              Transferir
            </Button>
          </>
        )}
      </ScrollView>
    </View>
  );
};
