import api from '.';
import {AppEvent} from '../../screens/Home';
import {MyEventResponse} from '../../screens/MyEvent';
import {FindMyEventsResponse} from '../../screens/MyEvents';
import {getTokenFromStorage} from '../../storage';

export async function findEventsOnApi(page: number) {
  const token = await getTokenFromStorage();
  return api.get('/events', {
    params: {page},
    headers: {Authorization: `Bearer ${token}`},
  });
}

export async function getEventOnApi(eventId: string) {
  const token = await getTokenFromStorage();
  return api.get<{event: AppEvent}>('/event', {
    params: {id: eventId},
    headers: {Authorization: `Bearer ${token}`},
  });
}

export async function reserveProductFromApi(productId: string) {
  const token = await getTokenFromStorage();

  return api.post<{id: string}>(
    '/event/reservation',
    {
      id: productId,
    },
    {
      headers: {Authorization: `Bearer ${token}`},
    },
  );
}

export async function findMyEventsOnApi(page: number) {
  const token = await getTokenFromStorage();

  return api.get<FindMyEventsResponse>('/my_events', {
    params: {
      page,
    },
    headers: {Authorization: `Bearer ${token}`},
  });
}

export async function findMyEventOnApi(eventId: string) {
  const token = await getTokenFromStorage();

  return api.get<MyEventResponse>('/my_event', {
    params: {
      id: eventId,
    },
    headers: {Authorization: `Bearer ${token}`},
  });
}
