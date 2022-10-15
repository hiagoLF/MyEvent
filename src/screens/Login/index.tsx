/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {AxiosError, AxiosResponse} from 'axios';
import React, {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {Alert, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {ActivityIndicator, Button, TextInput} from 'react-native-paper';
import {Card, Text} from 'react-native-paper';
import {useMutation, useQuery} from 'react-query';
import {useAppContext} from '../../context/AppContext';
import api from '../../services/api';
import {verifyTokenRequest} from '../../services/api/token';

interface Message {
  title: string;
  text: string;
}

interface RouteParams {
  message?: Message;
}

type RootStackParamList = {
  Profile: RouteParams;
};

type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'Profile'>;

interface LoginProps {
  login: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {name: string};
}

export const Login: React.FC = () => {
  const [loginVisible, setLoginVisible] = useState(false);
  const {navigate} = useNavigation();
  const {params} = useRoute<ProfileScreenRouteProp>();
  const {defineAuth} = useAppContext();
  const {reset} = useNavigation();

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm();

  async function loginRequest(registerProps: LoginProps) {
    return await api.post('/login', {...registerProps});
  }

  const loginMutation = useMutation(loginRequest, {
    onSuccess: handleLoginSuccess,
    onError: handleLoginError,
  });

  function onSubmit(values: any) {
    if (!loginMutation.isLoading) {
      loginMutation.mutate(values);
    }
  }

  async function handleLoginSuccess(data: AxiosResponse<LoginResponse>) {
    defineAuth(data.data);

    await new Promise(res => {
      Alert.alert('Sucesso', 'Você acabou de logar na aplicação. Aproveite!', [
        {
          text: 'Continuar',
          onPress: () => res(true),
        },
      ]);
    });

    goToApplication();
  }

  function goToApplication() {
    reset({
      routes: [
        {
          name: 'Application' as never,
          params: {},
        },
      ],
    });
  }

  function handleLoginError(error: AxiosError) {
    Alert.alert('Erro', error.response?.data?.message || error.message);
  }

  useEffect(() => {
    if (params?.message) {
      Alert.alert(params.message.title, params.message.text);
    }
  }, [params]);

  const verifyTokenQuery = useQuery('verify-token', verifyTokenRequest, {
    enabled: false,
    onSuccess: handleVerifyTokenSuccess,
    onError: handleVerifyTokenError,
    retry: false,
  });

  function handleVerifyTokenSuccess(data: AxiosResponse<LoginResponse>) {
    defineAuth(data.data);
    goToApplication();
  }

  function handleVerifyTokenError() {
    setLoginVisible(true);
  }

  useEffect(() => {
    verifyTokenQuery.refetch();
  }, []);

  if (!loginVisible) {
    return (
      <View style={{flex: 1, justifyContent: 'center'}}>
        <ActivityIndicator animating={true} />
      </View>
    );
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
            Login
          </Text>

          <View style={{marginVertical: 30}}>
            <Controller
              control={control}
              rules={{required: true}}
              name="login"
              render={({fieldState: {error}, field: {onChange}}) => (
                <TextInput
                  error={!!error}
                  onChangeText={onChange}
                  label="Login"
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
                  label="Senha"
                  secureTextEntry
                  style={{marginBottom: 10}}
                />
              )}
            />
          </View>

          <Button
            icon="login-variant"
            mode="contained"
            disabled={Object.keys(errors).length > 0 || loginMutation.isLoading}
            loading={loginMutation.isLoading}
            onPress={handleSubmit(onSubmit)}>
            Login
          </Button>

          <View style={{alignItems: 'center', marginTop: 20}}>
            <Text>Não possuiu conta?</Text>
            <Button
              compact
              mode="text"
              onPress={() => navigate('Register' as never)}>
              Registrar
            </Button>
          </View>
        </Card>
      </View>
    </ScrollView>
  );
};
