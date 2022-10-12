/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {Card, Paragraph, Text, Title} from 'react-native-paper';
import {AppHeader} from '../../components/AppHeader';
import QRCode from 'react-native-qrcode-svg';

const MyPurchase: React.FC = () => {
  const {goBack} = useNavigation();

  return (
    <View style={{flex: 1}}>
      <AppHeader title="Ingresso" backAction onBackActionPress={goBack} />

      <ScrollView contentContainerStyle={{padding: 10}}>
        <Card style={{marginBottom: 20}}>
          <Card.Cover
            source={{
              uri: 'https://www.vidyard.com/media/video-for-event-marketing.jpg',
            }}></Card.Cover>
        </Card>

        <Card style={{marginBottom: 20}}>
          <Card.Content>
            <Title>Simpósio - Educação e trabalho</Title>
            <Text variant="titleMedium">Valor: R$ 20,00</Text>
            <Paragraph>
              A educação é a base da coisa e sem ela o Brasil não vai pra
              frente, o que falou tá falando e ninguém pode negar...
            </Paragraph>
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
            <QRCode size={150} value="qcodeid34234234234234234df" />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default MyPurchase;
