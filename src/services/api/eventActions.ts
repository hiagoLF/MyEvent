import api from '.';
import {getTokenFromStorage} from '../../storage';

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
