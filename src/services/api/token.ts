import api from '.';
import {getTokenFromStorage} from '../../storage';

export async function verifyTokenRequest() {
  const token = await getTokenFromStorage();

  return await api.get('/valid_token', {
    headers: {Authorization: `Bearer ${token}`},
  });
}
