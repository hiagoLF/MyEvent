/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {View, ScrollView, Alert} from 'react-native';
import {Button, Card, TextInput, TouchableRipple} from 'react-native-paper';
import {AppHeader} from '../../components/AppHeader';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {useMutation} from 'react-query';
import {
  createEventOnApi,
  editEventOnApi,
  editImageOnApi,
} from '../../services/api/eventActions';
import {AxiosError, AxiosResponse} from 'axios';

interface RouteParams {
  type: 'edit' | 'create';
  eventId?: string;
  name?: string;
  desription?: string;
  valor?: string;
  ticketsNumber?: number;
  imageUrl?: string;
}

type RootStackParamList = {
  Profile?: RouteParams;
};

type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'Profile'>;

interface FormValues {
  valor: string;
  name: string;
  description: string;
  ticketsNumber: number;
}

interface ImageInfoToUpload {
  type: string;
  filename: string;
  name: string;
  uri: string;
}

export const CreateEditEvent: React.FC = () => {
  const {goBack, reset} = useNavigation();
  const {control, setValue, watch, register, formState, handleSubmit} =
    useForm<FormValues>();
  const [imageDefined, setImageDefined] = useState<string | undefined>();
  const [imageInfo, setImageInfo] = useState<ImageInfoToUpload | undefined>();

  const valor = watch('valor');

  const {params} = useRoute<ProfileScreenRouteProp>();

  const editImageMutation = useMutation(editImageOnApi, {
    onError: handleEditImageError,
    onSuccess: handleEditImageSucces,
  });

  function handleEditImageError(data: AxiosError) {
    Alert.alert('Erro', data.response?.data?.message || data.message);
  }

  function handleEditImageSucces(data: AxiosResponse) {
    Alert.alert(
      'Sucesso',
      `Evento ${params?.type === 'edit' ? 'alterado' : 'criado'} com sucesso`,
      [{text: 'Continuar', onPress: () => handleGoToEvent(data.data.eventId)}],
    );
  }

  function handleGoToEvent(eventId: string) {
    reset({
      routes: [
        {
          name: 'MyEvent' as never,
          params: {id: params?.eventId || eventId},
        },
      ],
    });
  }

  const editDataMutation = useMutation(editEventOnApi, {
    onSuccess: handleEditOrCreateSuccess,
    onError: handleEditOrCreateError,
  });

  const createEventMutation = useMutation(createEventOnApi, {
    onSuccess: handleEditOrCreateSuccess,
    onError: handleEditOrCreateError,
  });

  function handleEditOrCreateSuccess(data: AxiosResponse) {
    if (imageInfo) {
      const formData = new FormData();
      formData.append('image', imageInfo);
      formData.append('Content-Type', 'image/png');
      editImageMutation.mutate({eventId: data.data.id, formData});
    } else {
      Alert.alert('Sucesso', 'Evento alterado com sucesso', [
        {text: 'Continuar', onPress: () => handleGoToEvent(data.data.id)},
      ]);
    }
  }

  function handleEditOrCreateError() {
    Alert.alert('Erro', 'Não foi possível enviar os dados');
  }

  function onSubmit(values: FormValues) {
    if (params?.type === 'edit') {
      const dataToSend = {
        id: params?.eventId as string,
        name: values.name,
        description: values.description,
        valor: Number(values.valor.replace(/[^0-9]/g, '')),
        ticketsNumber: values.ticketsNumber,
      };

      editDataMutation.mutate(dataToSend);
    } else {
      const dataToSend = {
        name: values.name,
        description: values.description,
        valor: Number(values.valor.replace(/[^0-9]/g, '')),
        ticketsNumber: values.ticketsNumber,
      };

      createEventMutation.mutate(dataToSend);
    }
  }

  useEffect(() => {
    register('valor', {
      setValueAs: value => {
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(Number(value.replace(/[^0-9]/g, '')) / 100);
      },
      required: true,
    });
    params?.valor && setValue('valor', params?.valor.toString());
    params?.desription &&
      setValue('description', params?.desription, {shouldValidate: true});
    params?.name && setValue('name', params?.name, {shouldValidate: true});
    params?.ticketsNumber &&
      setValue('ticketsNumber', params?.ticketsNumber, {shouldValidate: true});
    setImageDefined(params?.imageUrl);
  }, [params?.eventId]);

  function handleImagePress() {
    Alert.alert('Inserir imagem', 'De onde você quer pegar sua imagem?', [
      {text: 'Voltar'},
      {text: 'Camera', onPress: handleSelectFromCamera},
      {text: 'Biblioteca', onPress: handleSelectFromStore},
    ]);
  }

  async function handleSelectFromCamera() {
    const image = await launchCamera({mediaType: 'photo', quality: 1});
    if (image.assets && image.assets[0]) {
      setImageDefined(image?.assets[0]?.uri);
      setImageInfo({
        type: image?.assets[0]?.type as string,
        filename: image?.assets[0]?.fileName as string,
        name: image?.assets[0]?.fileName as string,
        uri: image?.assets[0]?.uri as string,
      });
    }
  }

  async function handleSelectFromStore() {
    const image = await launchImageLibrary({mediaType: 'photo', quality: 1});
    if (image.assets && image.assets[0]) {
      setImageDefined(image?.assets[0]?.uri);
      setImageInfo({
        type: image?.assets[0]?.type as string,
        filename: image?.assets[0]?.fileName as string,
        name: image?.assets[0]?.fileName as string,
        uri: image?.assets[0]?.uri as string,
      });
    }
  }

  return (
    <View style={{flex: 1}}>
      <AppHeader
        title={params?.type === 'edit' ? 'EDITAR EVENTO' : 'CRIAR EVENTO'}
        backAction
        onBackActionPress={() => goBack()}
      />

      <ScrollView
        keyboardShouldPersistTaps="always"
        contentContainerStyle={{padding: 10}}>
        <TouchableRipple style={{marginBottom: 20}}>
          <Card onPress={handleImagePress}>
            <Card.Cover
              source={{
                uri: imageDefined,
              }}></Card.Cover>
          </Card>
        </TouchableRipple>
        <Controller
          control={control}
          rules={{required: true}}
          name="name"
          render={({fieldState: {error}, field: {onChange, value}}) => (
            <TextInput
              value={value}
              error={!!error}
              onChangeText={onChange}
              label="Nome"
              style={{marginBottom: 10}}
            />
          )}
        />
        <Controller
          control={control}
          rules={{required: true}}
          name="description"
          render={({fieldState: {error}, field: {onChange, value}}) => (
            <TextInput
              value={value}
              error={!!error}
              onChangeText={onChange}
              label="Descrição"
              style={{marginBottom: 10}}
              multiline
            />
          )}
        />
        <TextInput
          keyboardType="numeric"
          label="Valor"
          style={{marginBottom: 10}}
          value={valor}
          error={!!formState.errors.valor}
          onChangeText={value =>
            setValue('valor', value, {shouldValidate: true})
          }
        />
        <Controller
          control={control}
          rules={{required: true}}
          name="ticketsNumber"
          render={({fieldState: {error}, field: {onChange, value}}) => (
            <TextInput
              value={String(value || '')}
              error={!!error}
              onChangeText={onChange}
              keyboardType="numeric"
              label="Quantidade de ingressos"
              style={{marginBottom: 10}}
            />
          )}
        />
        <Button
          style={{marginBottom: 10}}
          icon="application-edit"
          mode="contained"
          disabled={
            Object.keys(formState.errors).length > 0 ||
            editDataMutation.isLoading
          }
          loading={
            editDataMutation.isLoading ||
            editImageMutation.isLoading ||
            createEventMutation.isLoading
          }
          onPress={handleSubmit(onSubmit)}>
          {params?.type === 'edit' ? 'EDITAR EVENTO' : 'CRIAR EVENTO'}
        </Button>
      </ScrollView>
    </View>
  );
};
