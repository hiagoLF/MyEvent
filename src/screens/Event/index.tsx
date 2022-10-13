/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {AxiosError, AxiosResponse} from 'axios';
import React, {useEffect} from 'react';
import {Alert, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {
  ActivityIndicator,
  Button,
  Card,
  Paragraph,
  Text,
  Title,
} from 'react-native-paper';
import {useMutation} from 'react-query';
import {AppHeader} from '../../components/AppHeader';
import {getEventOnApi, reserveProductFromApi} from '../../services/api/events';

interface RouteParams {
  id?: string;
}

type RootStackParamList = {
  Profile: RouteParams;
};

type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'Profile'>;

const Event: React.FC = () => {
  const {goBack, navigate} = useNavigation();
  const {params} = useRoute<ProfileScreenRouteProp>();

  const getEventMutation = useMutation(getEventOnApi);

  function loadData() {
    if (params.id || getEventMutation.isLoading) {
      getEventMutation.mutate(params.id as string);
    }
  }

  useEffect(() => {
    loadData();
  }, [params.id]);

  const bookProductMutation = useMutation(reserveProductFromApi, {
    onSuccess: handleReserveSuccess,
    onError: handleReserveError,
  });

  function handlePurchaseButtonClick() {
    bookProductMutation.mutate(params.id as string);
  }

  function handleReserveError(error: AxiosError) {
    console.log(error.request.requestBody);

    Alert.alert('Erro', error.response?.data?.message || error.message);
  }

  function handleReserveSuccess(reserve: AxiosResponse<{id: string}>) {
    navigate(
      'PurchaseData' as never,
      {
        reservationId: reserve.data.id,
        id: getEventMutation.data?.data.event.id,
        name: getEventMutation.data?.data.event.name,
        valor: getEventMutation.data?.data.event.valor,
      } as never,
    );
  }

  if (getEventMutation.isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center'}}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={{flex: 1}}>
      <AppHeader title="Evento" backAction onBackActionPress={goBack} />

      <ScrollView contentContainerStyle={{padding: 10}}>
        <Card style={{marginBottom: 20}}>
          <Card.Cover
            source={{uri: getEventMutation.data?.data.event.imageUrl}}
          />

          <Card.Content>
            <Title>{getEventMutation.data?.data.event.name}</Title>
            <Paragraph>
              {getEventMutation.data?.data.event.description}
            </Paragraph>
            <Text style={{marginTop: 10}} variant="titleLarge">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(getEventMutation.data?.data.event.valor as number)}
            </Text>
          </Card.Content>
        </Card>
        <Button mode="contained" onPress={handlePurchaseButtonClick}>
          Comprar
        </Button>
      </ScrollView>
    </View>
  );
};

export default Event;
