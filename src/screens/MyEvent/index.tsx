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
import {
  closeEventRequest,
  openEventRequest,
  removeEventRequest,
} from '../../services/api/eventActions';
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
  ticketsNumber: number;
  imageUrl: string;
}

export interface MyEventResponse {
  myEvent: MyEvent;
}

export const MyEvent: React.FC = () => {
  const {params} = useRoute<ProfileScreenRouteProp>();
  const [myEventData, setMyEventData] = useState<undefined | MyEvent>();
  const {navigate, reset} = useNavigation();

  console.log(myEventData);

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

  function handleOpenButtonPRess() {
    Alert.alert(
      'Abrir evento?',
      'Tem certeza que deseja abrir as vendas deste evento?',
      [
        {text: 'Cancelar'},
        {
          text: 'Continuar',
          style: 'destructive',
          onPress: () => openEventMutation.mutate(params.id as string),
        },
      ],
    );
  }

  const closeEventMutation = useMutation(closeEventRequest, {
    onSuccess: findMyEvent,
  });

  const openEventMutation = useMutation(openEventRequest, {
    onSuccess: findMyEvent,
  });

  const removerEventMutation = useMutation(removeEventRequest, {
    onSuccess: goToMyEvents,
  });

  function goToMyEvents() {
    reset({
      routes: [
        {
          name: 'MyEvents' as never,
          params: {},
        },
      ],
    });
  }

  function handleRemoveEventButtonPress() {
    Alert.alert(
      'Remover evento?',
      'Tem certeza que deseja remover este evento? Esta ação não poderá ser desfeita.',
      [
        {text: 'Cancelar'},
        {
          text: 'Continuar',
          style: 'destructive',
          onPress: () => removerEventMutation.mutate(params.id as string),
        },
      ],
    );
  }

  return (
    <View style={{flex: 1}}>
      <AppHeader
        title="Meu Evento"
        backAction
        onBackActionPress={async () => {
          navigate('MyEvents' as never);
        }}
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
              <Card.Cover source={{uri: myEventData?.imageUrl}} />

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
                  }).format((myEventData?.valor || 0) / 100)}
                </Text>
                <Text>Vendas: {myEventData?.sell}</Text>
                <Text>
                  Arrecadado:{' '}
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format((myEventData?.gain || 0) / 100)}
                </Text>
                <Text>
                  Resta{(myEventData?.rest || 0) > 1 && 'm'} {myEventData?.rest}{' '}
                  ingresso
                  {(myEventData?.rest || 0) > 1 && 's'}
                </Text>
              </Card.Content>
            </Card>

            <Button
              style={{marginBottom: 10}}
              icon="qrcode-scan"
              mode="contained"
              onPress={() =>
                navigate('QrScanner' as never, {id: params.id} as never)
              }>
              ESCANEAR INGRESSO
            </Button>

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

            {myEventData?.closed && (
              <Button
                style={{marginBottom: 10}}
                icon="lock-open"
                mode="contained"
                loading={openEventMutation.isLoading}
                disabled={openEventMutation.isLoading}
                onPress={handleOpenButtonPRess}>
                ABRIR VENDA
              </Button>
            )}

            <Button
              style={{marginBottom: 10}}
              icon="application-edit"
              mode="contained"
              onPress={() =>
                navigate(
                  'CreateEditEvent' as never,
                  {
                    type: 'edit',
                    eventId: params.id,
                    name: myEventData?.name,
                    desription: myEventData?.description,
                    valor: myEventData?.valor,
                    ticketsNumber: myEventData?.ticketsNumber,
                    imageUrl: myEventData?.imageUrl,
                  } as never,
                )
              }>
              EDITAR EVENTO
            </Button>

            {myEventData?.sell === 0 && (
              <Button
                style={{marginBottom: 10, backgroundColor: '#ff6262'}}
                icon="delete"
                mode="contained"
                loading={removerEventMutation.isLoading}
                disabled={removerEventMutation.isLoading}
                onPress={handleRemoveEventButtonPress}>
                REMOVER EVENTO
              </Button>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
};
