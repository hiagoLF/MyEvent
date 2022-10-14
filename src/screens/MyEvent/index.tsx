/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {AxiosError, AxiosResponse} from 'axios';
import React, {useEffect, useState} from 'react';
import {Alert, View} from 'react-native';
import {RefreshControl, ScrollView} from 'react-native-gesture-handler';
import {Button, Card, Paragraph, Text, Title} from 'react-native-paper';
import {useMutation} from 'react-query';
import {AppHeader} from '../../components/AppHeader';
import {closeEventRequest} from '../../services/api/eventActions';
import {findMyEventOnApi} from '../../services/api/events';

interface RouteParams {
  id?: string;
}

type RootStackParamList = {
  Profile: RouteParams;
};

type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'Profile'>;

interface MyEvent {
  name: string;
  description: string;
  valor: number;
  sell: number;
  gain: number;
  rest: number;
  closed: boolean;
}

export interface MyEventResponse {
  myEvent: MyEvent;
}

export const MyEvent: React.FC = () => {
  const {goBack} = useNavigation();
  const {params} = useRoute<ProfileScreenRouteProp>();
  const [myEventData, setMyEventData] = useState<undefined | MyEvent>();

  const myEventMutation = useMutation(findMyEventOnApi, {
    onError: handleGetMyEventError,
    onSuccess: handleGetMyEventSuccess,
  });

  function handleGetMyEventSuccess(
    myEventResponse: AxiosResponse<MyEventResponse>,
  ) {
    setMyEventData(myEventResponse.data.myEvent);
  }

  function handleGetMyEventError(responseError: AxiosError) {
    Alert.alert(
      'Erro',
      responseError.response?.data.message || responseError.message,
    );
  }

  function findMyEvent() {
    if (params.id) {
      myEventMutation.mutate(params.id);
    }
  }

  useEffect(() => {
    findMyEvent();
  }, [params.id]);

  function handleCloseEventPress() {
    Alert.alert(
      'Fechar evento?',
      'Tem certeza que deseja fechar as vendas deste evento?',
      [
        {text: 'Cancelar'},
        {
          text: 'Continuar',
          style: 'destructive',
          onPress: () => closeEventMutation.mutate(params.id as string),
        },
      ],
    );
  }

  console.log(params.id);

  const closeEventMutation = useMutation(closeEventRequest, {
    onSuccess: handleCloseEventSuccess,
  });

  function handleCloseEventSuccess() {
    myEventMutation.mutate(params.id as string);
  }

  return (
    <View style={{flex: 1}}>
      <AppHeader
        title="Meu Evento"
        backAction
        onBackActionPress={() => goBack()}
      />

      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={myEventMutation.isLoading}
            onRefresh={() => myEventMutation.mutate(params.id as string)}
          />
        }
        contentContainerStyle={{padding: 10}}>
        {myEventMutation.data && !myEventMutation.isLoading && (
          <>
            <Card style={{marginBottom: 10}}>
              <Card.Cover source={{uri: 'https://picsum.photos/700'}} />

              <Card.Content>
                <Title>{myEventData?.name}</Title>
                <Paragraph>{myEventData?.description}</Paragraph>
              </Card.Content>
            </Card>
            <Card style={{marginBottom: 30}}>
              <Card.Content>
                <Text>
                  Ingresso:{' '}
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(myEventData?.valor || 0)}
                </Text>
                <Text>Vendas: {myEventData?.sell}</Text>
                <Text>
                  Arrecadado:{' '}
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(myEventData?.gain || 0)}
                </Text>
                <Text>
                  Resta{(myEventData?.rest || 0) > 1 && 'm'} {myEventData?.rest}{' '}
                  ingresso
                  {(myEventData?.rest || 0) > 1 && 's'}
                </Text>
              </Card.Content>
            </Card>
            {!myEventData?.closed && (
              <Button
                style={{marginBottom: 10}}
                icon="lock"
                mode="elevated"
                loading={closeEventMutation.isLoading}
                disabled={closeEventMutation.isLoading}
                onPress={handleCloseEventPress}>
                FECHAR VENDA
              </Button>
            )}

            <Button
              style={{marginBottom: 10}}
              icon="lock-open"
              mode="contained"
              onPress={() => {}}>
              ABRIR VENDA
            </Button>

            <Button
              style={{marginBottom: 10}}
              icon="application-edit"
              mode="contained"
              onPress={() => {}}>
              EDITAR EVENTO
            </Button>

            <Button
              style={{marginBottom: 10, backgroundColor: '#ff6262'}}
              icon="delete"
              mode="contained"
              onPress={() => {}}>
              REMOVER EVENTO
            </Button>
          </>
        )}
      </ScrollView>
    </View>
  );
};
