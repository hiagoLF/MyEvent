import api from '.';
import {ScannerResponse} from '../../screens/QrScanner';
import {getTokenFromStorage} from '../../storage';

interface ScanQrCodeProps {
  qr: string;
  eventId: string;
}

export async function scanQrCodeRequest({qr, eventId}: ScanQrCodeProps) {
  const token = await getTokenFromStorage();
  return api.post<ScannerResponse>(
    '/scanner',
    {qr, eventId},
    {headers: {Authorization: `Bearer ${token}`}},
  );
}
