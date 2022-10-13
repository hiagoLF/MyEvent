import api from '.';
import {PurchaseData} from '../../screens/MyPurchase';
import {PurchasesResponse} from '../../screens/Purchases';
import {getTokenFromStorage} from '../../storage';

export async function findPurchasesOnApi(page: number) {
  const token = await getTokenFromStorage();
  return api.get<PurchasesResponse>('/purchases', {
    params: {page},
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
