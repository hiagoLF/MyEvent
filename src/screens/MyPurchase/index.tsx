/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Alert, View} from 'react-native';
import {RefreshControl, ScrollView} from 'react-native-gesture-handler';
import {Card, Paragraph, Text, Title} from 'react-native-paper';
import {AppHeader} from '../../components/AppHeader';
import QRCode from 'react-native-qrcode-svg';
import {useMutation} from 'react-query';
import {AxiosError, AxiosResponse} from 'axios';
import {findPurchaseOnApi} from '../../services/api/purchases';

export interface PurchaseData {
  qr: string;
  imageUrl: string;
  name: string;
  value: number;
  description: string;
}

interface RouteParams {
  id?: string;
}

type RootStackParamList = {
  Profile: RouteParams;
};

type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'Profile'>;

const MyPurchase: React.FC = () => {
  const {goBack} = useNavigation();
  const {params} = useRoute<ProfileScreenRouteProp>();

  const [purchaseData, setPurchaseData] = useState<PurchaseData | undefined>();

  const purchaseMutation = useMutation(findPurchaseOnApi, {
    onSuccess: handleGetEventsSuccess,
    onError: handleGetEventsError,
  });

  function handleGetEventsSuccess(
    purchaseResponse: AxiosResponse<{purchase: PurchaseData}>,
  ) {
    setPurchaseData(purchaseResponse.data.purchase);
  }

  function handleGetEventsError(responseError: AxiosError) {
    Alert.alert(
      'Erro',
      responseError.response?.data.message || responseError.message,
    );
  }

  function findPurchase() {
    setPurchaseData(undefined);
    if (params.id) {
      purchaseMutation.mutate(params.id);
    }
  }

  useEffect(() => {
    findPurchase();
  }, [params.id]);

  return (
    <View style={{flex: 1}}>
      <AppHeader title="Ingresso" backAction onBackActionPress={goBack} />
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={purchaseMutation.isLoading}
            onRefresh={findPurchase}
          />
        }
        contentContainerStyle={{padding: 10}}>
        {purchaseData && (
          <>
            <Card style={{marginBottom: 20}}>
              <Card.Cover
                source={{
                  uri: purchaseData?.imageUrl,
                }}></Card.Cover>
            </Card>

            <Card style={{marginBottom: 20}}>
              <Card.Content>
                <Title>{purchaseData?.name}</Title>
                <Text variant="titleMedium">
                  Valor:
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(purchaseData?.value || 0)}
                </Text>
                <Paragraph>{purchaseData?.description}</Paragraph>
              </Card.Content>
            </Card>

            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <View
                style={{
                  elevation: 5,
                  backgroundColor: '#FFFFFF',
                  padding: 10,
                  borderRadius: 5,
                  marginBottom: 40,
                }}>
                <QRCode size={150} value={purchaseData?.qr} />
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default MyPurchase;
