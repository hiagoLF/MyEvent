/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {Button, Card, Paragraph, Text, Title} from 'react-native-paper';
import {AppHeader} from '../../components/AppHeader';

// import { Container } from './styles';

const Event: React.FC = () => {
  const {goBack, navigate} = useNavigation();

  return (
    <View style={{flex: 1}}>
      <AppHeader title="Evento" backAction onBackActionPress={goBack} />

      <ScrollView contentContainerStyle={{padding: 10}}>
        <Card style={{marginBottom: 20}}>
          <Card.Cover source={{uri: 'https://picsum.photos/700'}} />

          <Card.Content>
            <Title>Festa da Ururuca</Title>
            <Paragraph>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
              rhoncus, massa at interdum aliquet, felis turpis pellentesque
              lorem, ut eleifend odio diam vitae ex. Sed eleifend neque purus,
            </Paragraph>
            <Text style={{marginTop: 10}} variant="titleLarge">
              R$ 150,00
            </Text>
          </Card.Content>
        </Card>
        <Button
          mode="contained"
          onPress={() =>
            navigate('PurchaseData' as never, {id: 'sdfadffasd'} as never)
          }>
          Comprar
        </Button>
      </ScrollView>
    </View>
  );
};

export default Event;
