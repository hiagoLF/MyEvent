import api from '.';
import {getTokenFromStorage} from '../../storage';

export async function findEventsOnApi(page: number) {
  const token = await getTokenFromStorage();
  return api.get('/events', {
    params: {page},
    headers: {Authorization: `Bearer ${token}`},
  });
}
