/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import {AxiosError, AxiosResponse} from 'axios';
import React, {useEffect, useState} from 'react';
import {Alert, View} from 'react-native';
import {FlatList, RefreshControl} from 'react-native-gesture-handler';
import {FAB, Searchbar} from 'react-native-paper';
import {useMutation} from 'react-query';
import {AppHeader} from '../../components/AppHeader';
import LittleCard from '../../components/LittleCard';
import {findPurchasesOnApi} from '../../services/api/purchases';

interface Event {
  id: string;
  name: string;
}

interface Purchase {
  id: string;
  event: Event;
}

export interface PurchasesResponse {
  purchases: Purchase[];
}

export const Purchases: React.FC = () => {
  const {navigate} = useNavigation();

  const [purchases, setMyPurchases] = useState<Purchase[]>([]);
  const [currentPage, setCurrentPage] = useState<undefined | number>(1);
  const [searchMode, setSearchMode] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const getPurchasesMutation = useMutation(findPurchasesOnApi, {
    onSuccess: handleGetPurchasesSuccess,
    onError: handleGetPurchasesError,
  });

  function handleGetPurchasesSuccess(
    eventsResponse: AxiosResponse<PurchasesResponse>,
  ) {
    if (eventsResponse.data.purchases.length === 0) {
      setCurrentPage(undefined);
    } else {
      setCurrentPage(prev => (prev as number) + 1);
      setMyPurchases(prev => [...prev, ...eventsResponse.data.purchases]);
    }
  }

  function handleGetPurchasesError(responseError: AxiosError) {
    Alert.alert(
      'Erro',
      responseError.response?.data.message || responseError.message,
    );
  }

  useEffect(() => {
    getPurchasesMutation.mutate({
      page: currentPage as number,
      query: searchMode ? searchValue : '',
    });
  }, []);

  function handleOnEndReached() {
    if (!getPurchasesMutation.isLoading && currentPage) {
      getPurchasesMutation.mutate({
        page: currentPage,
        query: searchMode ? searchValue : '',
      });
    }
  }

  function handleRefresh() {
    setCurrentPage(1);
    setMyPurchases([]);
    getPurchasesMutation.mutate({
      page: 1,
      query: searchMode ? searchValue : '',
    });
  }

  function handleSearchButtonPress() {
    setMyPurchases([]);
    setCurrentPage(1);
    getPurchasesMutation.mutate({
      page: 1,
      query: searchMode ? searchValue : '',
    });
  }

  return (
    <View style={{flex: 1}}>
      <AppHeader
        title="Compras"
        backAction
        onBackActionPress={() => navigate('Home' as never)}
      />

      {searchMode && (
        <Searchbar
          placeholder="Search"
          onChangeText={setSearchValue}
          value={searchValue}
          loading={getPurchasesMutation.isLoading}
          onSubmitEditing={handleSearchButtonPress}
        />
      )}

      <FAB
        icon={searchMode ? 'magnify-minus' : 'magnify'}
        size={searchMode ? 'medium' : 'small'}
        style={{
          position: 'absolute',
          margin: 16,
          right: 0,
          bottom: 0,
          zIndex: 1,
        }}
        onPress={() => setSearchMode(prev => !prev)}
      />

      <FlatList
        style={{padding: 10}}
        data={purchases}
        onEndReached={handleOnEndReached}
        onEndReachedThreshold={1}
        refreshControl={
          <RefreshControl
            refreshing={getPurchasesMutation.isLoading}
            onRefresh={handleRefresh}
          />
        }
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={{marginBottom: 10}}>
            <LittleCard
              title={item.event.name}
              onPress={() =>
                navigate('MyPurchase' as never, {id: item.id} as never)
              }
            />
          </View>
        )}
      />
    </View>
  );
};
