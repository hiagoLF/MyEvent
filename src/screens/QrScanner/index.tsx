import {RouteProp, useRoute} from '@react-navigation/native';
import {AxiosError, AxiosResponse} from 'axios';
import React, {useRef} from 'react';
import {Alert, View} from 'react-native';

import QRCodeScanner from 'react-native-qrcode-scanner';
import {useMutation} from 'react-query';
import {scanQrCodeRequest} from '../../services/api/qrCode';

interface RouteParams {
  id?: string;
}

type RootStackParamList = {
  Profile: RouteParams;
};

type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'Profile'>;

export interface ScannerResponse {
  title: string;
  message: string;
}

interface ScannerError {
  message: string;
}

const QrScanner: React.FC = () => {
  const {params} = useRoute<ProfileScreenRouteProp>();

  const qrScannerRef = useRef<QRCodeScanner>(null);

  const scanQrCodeMutation = useMutation(scanQrCodeRequest, {
    onSuccess: handleRequestScannerSuccess,
    onError: handleRequestScannerError,
  });

  function handleRequestScannerSuccess(data: AxiosResponse<ScannerResponse>) {
    Alert.alert(data.data.title, data.data.message, [
      {text: 'OK', onPress: reactivateQrScanner},
    ]);
  }

  function handleRequestScannerError(error: AxiosError<ScannerError>) {
    Alert.alert('Erro', error.response?.data.message || error.message, [
      {text: 'OK', onPress: reactivateQrScanner},
    ]);
  }

  function reactivateQrScanner() {
    qrScannerRef.current?.reactivate();
  }

  function onSuccess(data: any) {
    scanQrCodeMutation.mutate({qr: data.data, eventId: params.id as string});
  }

  return (
    <View style={{flex: 1}}>
      <QRCodeScanner onRead={onSuccess} ref={qrScannerRef} />
    </View>
  );
};

export default QrScanner;
