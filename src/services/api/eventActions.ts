import api from '.';
import {getTokenFromStorage} from '../../storage';

interface EventDataToSend {
  id: string;
  name: string;
  description: string;
  valor: number;
  ticketsNumber: number;
}

interface EditImageProps {
  eventId: string;
  formData: FormData;
}

interface EventDataToSendOnCreation {
  name: string;
  description: string;
  valor: number;
  ticketsNumber: number;
}

export async function closeEventRequest(eventId: string) {
  const token = await getTokenFromStorage();

  return api.put(
    '/event/close',
    {},
    {
      params: {id: eventId},
      headers: {Authorization: `Bearer ${token}`},
    },
  );
}

export async function openEventRequest(eventId: string) {
  const token = await getTokenFromStorage();

  return api.put(
    '/event/open',
    {},
    {
      params: {id: eventId},
      headers: {Authorization: `Bearer ${token}`},
    },
  );
}

export async function editEventOnApi(data: EventDataToSend) {
  const token = await getTokenFromStorage();

  return api.put('/event', data, {
    params: {id: data.id},
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
}

export async function editImageOnApi({eventId, formData}: EditImageProps) {
  const token = await getTokenFromStorage();

  return api.put('/event/image', formData, {
    params: {id: eventId},
    headers: {Authorization: `Bearer ${token}`},
  });
}

export async function createEventOnApi(data: EventDataToSendOnCreation) {
  const token = await getTokenFromStorage();

  return api.post('/event', data, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
}

export async function removeEventRequest(eventId: string) {
  const token = await getTokenFromStorage();

  return api.delete('/event', {
    params: {id: eventId},
    headers: {Authorization: `Bearer ${token}`},
  });
}
