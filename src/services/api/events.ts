import api from '.';
import {AppEvent} from '../../screens/Home';
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
