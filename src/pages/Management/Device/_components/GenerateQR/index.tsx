import { FC } from 'react';
import QRCode from 'react-qr-code';

import { Button } from '@/components/ui/button';
import { DrawerClose, DrawerFooter } from '@/components/ui/drawer';

interface Props {
  qrValue: string;
}

const GenerateQRCode: FC<Props> = ({ qrValue }) => {
  return (
    <>
      <div className="mb-10 mt-5 px-10">
        <QRCode
          size={200}
          className="h-full w-full max-w-full print:block"
          value={qrValue}
          viewBox={`0 0 200 200`}
        />
      </div>

      <DrawerFooter className="flex flex-row justify-center gap-4 p-0 print:hidden">
        <DrawerClose asChild>
          <Button className="btn-terinary-gray hover:hover-btn-terinary-gray w-full">
            Cancel
          </Button>
        </DrawerClose>
        <DrawerClose asChild>
          <Button
            type="submit"
            onClick={() => window.print()}
            className="btn-secondary-midnight-blue hover:hover-btn-secondary-midnight-blue  w-full"
          >
            Print QR
          </Button>
        </DrawerClose>
      </DrawerFooter>
    </>
  );
};

export default GenerateQRCode;
