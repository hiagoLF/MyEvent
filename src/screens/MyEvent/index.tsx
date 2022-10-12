/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {
  Button,
  Card,
  Dialog,
  Paragraph,
  Portal,
  Text,
  Title,
} from 'react-native-paper';
import {AppHeader} from '../../components/AppHeader';

export const MyEvent: React.FC = () => {
  const {goBack} = useNavigation();
  const [dialogVisible, setDialogVisible] = useState(false);
  const {navigate} = useNavigation();

  return (
    <View style={{flex: 1}}>
      <AppHeader
        title="Meu Evento"
        backAction
        onBackActionPress={() => goBack()}
      />

      <Portal>
        <Dialog
          visible={dialogVisible}
          onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>Alerta</Dialog.Title>
          <Dialog.Content>
            <Paragraph>A alteração será realizada. Deseja continuar?</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>NÃO</Button>
            <Button onPress={() => setDialogVisible(false)}>SIM</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <ScrollView contentContainerStyle={{padding: 10}}>
        <Card style={{marginBottom: 10}}>
          <Card.Cover source={{uri: 'https://picsum.photos/700'}} />

          <Card.Content>
            <Title>Festa da Ururuca</Title>
            <Paragraph>
              Muita doideira nessa festa que já é de doisdo e doido vai ser
              doido dfsdfa...
            </Paragraph>
          </Card.Content>
        </Card>
        <Card style={{marginBottom: 30}}>
          <Card.Content>
            <Text>Ingresso: R$ 20,00</Text>
            <Text>Vendas: 13</Text>
            <Text>Arrecadado: R$ 280,00</Text>
            <Text>Restam 5 ingressos</Text>
          </Card.Content>
        </Card>
        <Button
          style={{marginBottom: 10}}
          icon="lock"
          mode="elevated"
          onPress={() => setDialogVisible(true)}>
          FECHAR VENDA
        </Button>

        <Button
          style={{marginBottom: 10}}
          icon="lock-open"
          mode="contained"
          onPress={() => setDialogVisible(true)}>
          ABRIR VENDA
        </Button>

        <Button
          style={{marginBottom: 10}}
          icon="application-edit"
          mode="contained"
          onPress={() => navigate('CreateEditEvent' as never)}>
          EDITAR EVENTO
        </Button>

        <Button
          style={{marginBottom: 10, backgroundColor: '#ff6262'}}
          icon="delete"
          mode="contained"
          onPress={() => setDialogVisible(true)}>
          REMOVER EVENTO
        </Button>
      </ScrollView>
    </View>
  );
};
