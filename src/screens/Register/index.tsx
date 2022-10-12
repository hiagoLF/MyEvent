/* eslint-disable dot-notation */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {Alert, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {Button, TextInput} from 'react-native-paper';
import {Card, Text} from 'react-native-paper';
import {useForm, Controller} from 'react-hook-form';
import {useMutation} from 'react-query';
import api from '../../services/api';
import {AxiosError} from 'axios';

interface RegisterProps {
  name: string;
  login: string;
  password: string;
  passwordAgain: string;
}

export const Register: React.FC = () => {
  const {navigate, reset} = useNavigation();
  const {
    control,
    handleSubmit,
    watch,
    formState: {errors},
  } = useForm();

  const currentPassword = watch('password');

  console.log(currentPassword);

  async function registerRequest(registerProps: RegisterProps) {
    return await api.post('/api/user', {...registerProps});
  }

  const registerMutation = useMutation(registerRequest, {
    onSuccess: handleRegisterSuccess,
    onError: handleRegisterError,
  });

  function onSubmit(values: any) {
    values['passwordAgain'] = undefined;
    if (!registerMutation.isLoading) {
      registerMutation.mutate(values);
    }
  }

  function handleRegisterError(error: AxiosError) {
    Alert.alert('Erro', error.response?.data.message);
  }

  function handleRegisterSuccess() {
    reset({
      routes: [
        {
          name: 'Login' as never,
          params: {
            message: {
              title: 'Sucesso!',
              text: 'Sua conta foi criada! Agora faça login',
            },
          },
        },
      ],
    });
  }

  return (
    <ScrollView
      keyboardShouldPersistTaps="always"
      contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}>
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
            <Controller
              control={control}
              rules={{required: true}}
              name="name"
              render={({fieldState: {error}, field: {onChange}}) => (
                <TextInput
                  error={!!error}
                  onChangeText={onChange}
                  label="Seu Nome"
                  style={{marginBottom: 10}}
                />
              )}
            />
            <Controller
              control={control}
              rules={{required: true}}
              name="login"
              render={({fieldState: {error}, field: {onChange}}) => (
                <TextInput
                  error={!!error}
                  onChangeText={onChange}
                  label="Criar Login"
                  style={{marginBottom: 10}}
                />
              )}
            />
            <Controller
              control={control}
              rules={{required: true}}
              name="password"
              render={({fieldState: {error}, field: {onChange}}) => (
                <TextInput
                  error={!!error}
                  onChangeText={onChange}
                  label="Criar Senha"
                  style={{marginBottom: 10}}
                  secureTextEntry={true}
                />
              )}
            />
            <Controller
              control={control}
              rules={{
                required: true,
                validate: pAgain => pAgain === currentPassword,
              }}
              name="passwordAgain"
              render={({fieldState: {error}, field: {onChange}}) => (
                <TextInput
                  error={!!error}
                  onChangeText={onChange}
                  label="Repetir Senha"
                  style={{marginBottom: 10}}
                  secureTextEntry={true}
                />
              )}
            />
          </View>

          <Button
            icon="login-variant"
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            disabled={Object.keys(errors).length > 0}
            loading={registerMutation.isLoading}>
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
