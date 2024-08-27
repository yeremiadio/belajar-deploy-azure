import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ScanQRIcon } from '@/assets/images';
import { ModalMobile } from '@/components/ModalMobile';
import QRReader from '@/components/QRReader';
import { toast } from '@/components/ui/use-toast';
import { ROUTES } from '@/utils/configs/route';
import generateDynamicToastMessage from '@/utils/functions/generateDynamicToastMessage';
import { useModal } from '@/utils/hooks/useModal';
import { useGetReservationByTagIdQuery } from '@/stores/reservationStore/reservationStoreApi';
import { isPositiveInteger } from '@/utils/functions/isPositiveInteger';

export const ScanQR = () => {
  const [scannedResult, setScannedResult] = useState<string>('');
  const { toggle: toggleQR, isShown: isShownQR } = useModal();
  const navigate = useNavigate();

  const { data: reservationDetail, isFetching, isLoading } = useGetReservationByTagIdQuery(
    { id: Number(scannedResult) },
    { skip: !scannedResult || !isPositiveInteger(scannedResult) },
  );
  const loading = isFetching || isLoading

  useEffect(() => {
    if (scannedResult && !loading) {
      console.log({scannedResult})
      if (!isPositiveInteger(scannedResult)) {
        toast(
          generateDynamicToastMessage({
            title: 'QR Code',
            description: `The QR Code is Invalid`,
            variant: 'error',
          }),
        );
      } else {
        navigate(
          ROUTES.mobileReservationDetail(reservationDetail ? reservationDetail.id.toString() : "0"),
        );
      }
      toggleQR();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scannedResult, loading, reservationDetail]);

  return (
    <>
      <ModalMobile title="QR Scanner" toggle={toggleQR} isShown={isShownQR}>
        <QRReader setScannedResult={setScannedResult} />
      </ModalMobile>
      <div className="box-border flex flex-col justify-center gap-2 overflow-hidden rounded-xl border-2 border-rs-v2-thunder-blue bg-rs-v2-navy-blue p-5 pt-2">
        <img src={ScanQRIcon} alt="scanQR" className="mx-auto w-[40%]" />
        <button
          className="w-full cursor-pointer rounded-xl bg-rs-v2-mint py-4"
          onClick={() => {
            toggleQR();
          }}
        >
          <span className="text-sm font-semibold text-black">SCAN QR</span>
        </button>
      </div>
    </>
  );
};
