import QRCode from 'react-qr-code';

import { Button } from '@/components/ui/button';

import { IMachine } from '@/types/api/management/machine';
import { TModalFormProps } from '@/types/modal';

import handleClickPrintQr from '@/utils/functions/handleClickPrintQr';

const GenerateQR = ({ data }: TModalFormProps<IMachine>) => {
  return (
    <div>
      <div
        id="printQr"
       
        className="mx-auto h-auto w-full max-w-[320px] rounded-md bg-white p-2"
      >
        {data?.code ? (
          <QRCode
            bgColor="#35363a"
            fgColor="#FFFFFF"
            data-testid="qr-code"
            style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
            value={data?.code ?? ''}
            viewBox={`0 0 120 120`}
          />
        ) : null}
      </div>
      <Button
        onClick={handleClickPrintQr}
        className="btn-secondary-midnight-blue hover:hover-btn-secondary-midnight-blue mt-4 w-full"
      >
        Download QR Code
      </Button>
    </div>
  );
};

export default GenerateQR;
