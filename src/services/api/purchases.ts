import api from '.';
import {PurchaseData} from '../../screens/MyPurchase';
import {PurchasesResponse} from '../../screens/Purchases';
import {getTokenFromStorage} from '../../storage';

interface FindPurchasesProps {
  page: number;
  query: string;
}

export async function findPurchasesOnApi({page, query}: FindPurchasesProps) {
  const token = await getTokenFromStorage();
  return api.get<PurchasesResponse>('/purchases', {
    params: {page, query},
    headers: {Authorization: `Bearer ${token}`},
  });
}

export async function findPurchaseOnApi(purchaseId: string) {
  const token = await getTokenFromStorage();
  return api.get<{purchase: PurchaseData}>('/purchase', {
    params: {id: purchaseId},
    headers: {Authorization: `Bearer ${token}`},
  });
}
