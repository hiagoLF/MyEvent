/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import {AxiosError, AxiosResponse} from 'axios';
import React, {useEffect, useState} from 'react';
import {Alert, FlatList, View} from 'react-native';
import {RefreshControl} from 'react-native-gesture-handler';
import {Card, Text} from 'react-native-paper';
import {useMutation} from 'react-query';
import {AppHeader} from '../../components/AppHeader';
import {findEventsOnApi} from '../../services/api/events';

export interface AppEvent {
  id: string;
  name: string;
  description?: string;
  valor: number;
  imageUrl: string;
}

interface EventsResponse {
  data: AppEvent[];
}

export const Home: React.FC = () => {
  const {navigate} = useNavigation();
  const [eventsList, setEventsList] = useState<AppEvent[]>([]);
  const [currentPage, setCurrentPage] = useState<undefined | number>(1);

  const eventsMutation = useMutation(findEventsOnApi, {
    onSuccess: handleGetEventsSuccess,
    onError: handleGetEventsError,
  });

  function handleGetEventsSuccess(
    eventsResponse: AxiosResponse<EventsResponse>,
  ) {
    if (eventsResponse.data.data.length === 0) {
      setCurrentPage(undefined);
    } else {
      setCurrentPage(prev => (prev as number) + 1);
      setEventsList(prev => [...prev, ...eventsResponse.data.data]);
    }
  }

  function handleGetEventsError(responseError: AxiosError) {
    Alert.alert(
      'Erro',
      responseError.response?.data.message || responseError.message,
    );
  }

  useEffect(() => {
    eventsMutation.mutate(currentPage as number);
  }, []);

  function handleOnEndReached() {
    if (!eventsMutation.isLoading && currentPage) {
      eventsMutation.mutate(currentPage);
    }
  }

  function handleRefreshEvents() {
    setEventsList([]);
    setCurrentPage(1);
    eventsMutation.mutate(1);
  }

  return (
    <View style={{flex: 1}}>
      <AppHeader title="Home" />

      <FlatList
        data={eventsList}
        keyExtractor={item => item.id}
        onEndReachedThreshold={1}
        onEndReached={handleOnEndReached}
        refreshControl={
          <RefreshControl
            refreshing={eventsMutation.isLoading}
            onRefresh={handleRefreshEvents}
          />
        }
        renderItem={({item}) => (
          <View style={{padding: 5}}>
            <Card
              elevation={5}
              onPress={() =>
                navigate('Event' as never, {id: item.id} as never)
              }>
              <Card.Cover source={{uri: item.imageUrl}} />
              <Card.Title titleVariant="titleLarge" title={item.name} />
              <Card.Content>
                <Text variant="labelLarge">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(item.valor)}
                </Text>
              </Card.Content>
            </Card>
          </View>
        )}
      />
    </View>
  );
};
