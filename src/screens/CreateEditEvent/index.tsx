/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {View, ScrollView} from 'react-native';
import {
  Button,
  Card,
  Dialog,
  Paragraph,
  Portal,
  TextInput,
  TouchableRipple,
} from 'react-native-paper';
import {AppHeader} from '../../components/AppHeader';

// import { Container } from './styles';

export const CreateEditEvent: React.FC = () => {
  const {goBack} = useNavigation();
  function handleImagePress() {
    setDialogVisible(true);
  }
  const [dialogVisible, setDialogVisible] = useState(false);

  return (
    <View style={{flex: 1}}>
      <AppHeader
        title="EDITAR EVENTO"
        backAction
        onBackActionPress={() => goBack()}
      />

      <Portal>
        <Dialog
          visible={dialogVisible}
          onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>Alterar imagem</Dialog.Title>
          <Dialog.Content>
            <Paragraph>O que você deseja fazer</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>Remover</Button>
            <Button onPress={() => setDialogVisible(false)}>Substituir</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <ScrollView
        keyboardShouldPersistTaps={true}
        contentContainerStyle={{padding: 10}}>
        <TouchableRipple style={{marginBottom: 20}}>
          <Card onPress={handleImagePress}>
            <Card.Cover
              source={{
                uri: 'https://www.vidyard.com/media/video-for-event-marketing.jpg',
              }}></Card.Cover>
          </Card>
        </TouchableRipple>
        <TextInput label="Nome" style={{marginBottom: 10}} />
        <TextInput label="Descrição" style={{marginBottom: 10}} />
        <TextInput label="Valor" style={{marginBottom: 10}} />
        <TextInput label="Quantidade de ingressos" style={{marginBottom: 30}} />
        <Button
          style={{marginBottom: 10}}
          icon="application-edit"
          mode="contained"
          onPress={() => {}}>
          EDITAR EVENTO
        </Button>
      </ScrollView>
    </View>
  );
};
