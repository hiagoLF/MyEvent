/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import {AxiosError, AxiosResponse} from 'axios';
import React, {useEffect, useState} from 'react';
import {Alert, View} from 'react-native';
import {FlatList, RefreshControl} from 'react-native-gesture-handler';
import {FAB} from 'react-native-paper';
import {useMutation} from 'react-query';
import {AppHeader} from '../../components/AppHeader';
import LittleCard from '../../components/LittleCard';
import {findMyEventsOnApi} from '../../services/api/events';

export interface MyEvent {
  id: string;
  title: string;
  sell: number;
}

export interface FindMyEventsResponse {
  myEvents: MyEvent[];
}

export const MyEvents: React.FC = () => {
  const {navigate} = useNavigation();
  const [myEventsList, setMyEventsList] = useState<MyEvent[]>([]);
  const [currentPage, setCurrentPage] = useState<undefined | number>(1);

  const getEventsMutation = useMutation(findMyEventsOnApi, {
    onSuccess: handleGetEventsSuccess,
    onError: handleGetEventsError,
  });

  function handleGetEventsSuccess(
    eventsResponse: AxiosResponse<FindMyEventsResponse>,
  ) {
    if (eventsResponse.data.myEvents.length === 0) {
      setCurrentPage(undefined);
    } else {
      setCurrentPage(prev => (prev as number) + 1);
      setMyEventsList(prev => [...prev, ...eventsResponse.data.myEvents]);
    }
  }

  function handleGetEventsError(responseError: AxiosError) {
    Alert.alert(
      'Erro',
      responseError.response?.data.message || responseError.message,
    );
  }

  useEffect(() => {
    getEventsMutation.mutate(currentPage as number);
  }, []);

  function handleOnEndReached() {
    if (!getEventsMutation.isLoading && currentPage) {
      getEventsMutation.mutate(currentPage);
    }
  }

  function handleRefreshEvents() {
    setMyEventsList([]);
    setCurrentPage(1);
    getEventsMutation.mutate(1);
  }

  return (
    <View style={{flex: 1}}>
      <AppHeader
        title="Meus Eventos"
        backAction
        onBackActionPress={() => navigate('Home' as never)}
      />

      <FAB
        icon="plus"
        style={{
          position: 'absolute',
          margin: 16,
          right: 0,
          bottom: 0,
          zIndex: 5,
        }}
        variant="tertiary"
        onPress={() => navigate('CreateEditEvent' as never)}
      />

      <FlatList
        style={{padding: 5}}
        data={myEventsList}
        refreshControl={
          <RefreshControl
            refreshing={getEventsMutation.isLoading}
            onRefresh={handleRefreshEvents}
          />
        }
        onEndReached={handleOnEndReached}
        onEndReachedThreshold={1}
        keyExtractor={({id}) => id}
        renderItem={({item}) => (
          <View style={{marginBottom: 8}}>
            <LittleCard
              onPress={() =>
                navigate('MyEvent' as never, {id: item.id} as never)
              }
              title={item.title}
              subtitle={`Vendas: ${item.sell}`}
            />
          </View>
        )}
      />
    </View>
  );
};
