import api from '.';
import {FinalizePurchaseProps} from '../../screens/FinalizePurchase';
import {PurchaseValues} from '../../screens/PurchaseData';
import {getTokenFromStorage} from '../../storage';

interface FinalizePurchaseOnApi {
  purchaseValues: PurchaseValues;
  reservationId: string;
  card: FinalizePurchaseProps;
}

export async function finalizePurchaseOnApi({
  card,
  purchaseValues,
  reservationId,
}: FinalizePurchaseOnApi) {
  const token = await getTokenFromStorage();

  return api.post(
    '/event/reservation/finalize',
    {
      purchaseValues,
      reservationId,
      card,
    },
    {
      headers: {Authorization: `Bearer ${token}`},
    },
  );
}
