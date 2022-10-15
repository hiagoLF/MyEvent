import api from '.';
import {SailsResponse} from '../../screens/Sales';
import {getTokenFromStorage} from '../../storage';

interface TransferValues {
  valor: number;
  bankNumber: string;
  account: string;
}

export async function getMySailsOnAPi() {
  const token = await getTokenFromStorage();
  return api.get<SailsResponse>('/sails', {
    headers: {Authorization: `Bearer ${token}`},
  });
}

export async function transferResquest(values: TransferValues) {
  const token = await getTokenFromStorage();
  return api.post<SailsResponse>('/transfer', values, {
    headers: {Authorization: `Bearer ${token}`},
  });
}
transferResquest;
