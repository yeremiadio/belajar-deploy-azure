import dayjs from 'dayjs';
import { MdPrint } from 'react-icons/md';
import QRCode from 'react-qr-code';
import { MdOutlineDownload } from 'react-icons/md';

import { Button } from '@/components/ui/button';
import { TReservationObject } from '@/types/api/reservation';
import { TModalFormProps } from '@/types/modal';
import { downloadFileWithBearerToken } from '@/utils/functions/downloadFileWithBearerToken';

const ReservationDetail = ({
  data,
}: TModalFormProps<TReservationObject | undefined>) => {
  return (
    <>
      <div className="grid max-h-[320px] gap-4 overflow-y-auto sm:max-h-max sm:grid-cols-1 md:grid-cols-3">
        <div className="col-span-2 flex flex-col gap-4">
          <p className="pb-2">Reservation ID: {data?.id}</p>
          <div className="grid grid-cols-[max-content_auto] gap-4">
            <p>Category</p>
            <div className="flex items-center">
              : <p className="pl-2">{data?.category ?? '-'}</p>
            </div>
            <p>Type</p>
            <div className="flex items-center">
              :{' '}
              <p className="pl-2">
                {data?.isPriority ? 'Priority' : 'Not Priority' ?? '-'}
              </p>
            </div>
            <p>Delivery Order</p>
            <div className="flex items-center">
              : <p className="pl-2">{data?.orderDelivery?.id ?? '-'}</p>
            </div>
            <p>Vendor</p>
            <div className="flex items-center">
              : <p className="pl-2">{data?.vendor?.name ?? '-'}</p>
            </div>
            <p>Driver Name</p>
            <div className="flex items-center">
              : <p className="pl-2">{data?.driver?.name ?? '-'}</p>
            </div>
            <p>Vehicle</p>
            <div className="flex items-center">
              : <p className="pl-2">{data?.licensePlate?.plate ?? '-'}</p>
            </div>
            <p>Expected Check-In</p>
            <div className="flex items-center">
              :{' '}
              <p className="pl-2">
                {dayjs(data?.expectedCheckInDate).format('DD/MM/YYYY') ?? '-'}
              </p>
            </div>
            <p>Document ID</p>
            <div className="flex items-center">
              : <p className="pl-2">{data?.documentId ?? '-'}</p>
            </div>
            <p>File</p>
            <div className="flex flex-row items-center">
              : <p className="pl-2"></p>
              {data?.fileUrls && data?.fileUrls?.length > 0 ? (
                <Button
                  className="bg-transparent p-2 text-white hover:bg-transparent"
                  onClick={() =>
                    downloadFileWithBearerToken(data?.fileUrls?.[0] ?? '')
                  }
                >
                  <p className="me-2">Download File</p>
                  <MdOutlineDownload size={24} className="text-rs-azure-blue" />
                </Button>
              ) : (
                '-'
              )}
            </div>
          </div>

          <div className="border-b border-solid border-b-rs-v2-thunder-blue" />

          <table className="w-full table-auto border-separate border-spacing-0 rounded-md border border-solid border-rs-v2-gunmetal-blue">
            <thead className="text-left">
              <tr>
                <th className="w-[300px] p-3">Inventory</th>
                <th className="border-l border-solid border-rs-v2-gunmetal-blue p-3">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {data?.reservationItems.map((field) => (
                <tr className="table-row bg-rs-v2-galaxy-blue" key={field.id}>
                  <td className="border-t border-solid border-rs-v2-gunmetal-blue p-2 text-left">
                    {field.inventory?.name ?? '-'}
                  </td>
                  <td className="border-l border-t border-solid border-rs-v2-gunmetal-blue p-2 text-left">
                    {field.amount ?? '-'} {field.unit}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="col-span-1 flex h-full w-full flex-col items-start gap-3">
          <div className="mx-auto flex flex-col items-center">
            <p className="text-white">RFID Tag ID</p>
            <p className="text-white">{data?.tag?.id}</p>
          </div>
          <p className="mx-auto text-rs-neutral-chromium">QR-Code</p>
          <div
            id="printQr"
            className="mx-auto h-auto w-full max-w-[180px] rounded-md bg-white p-2 md:max-w-full"
          >
            <QRCode
              bgColor="#35363a"
              fgColor="#FFFFFF"
              style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
              value={data?.tag?.id?.toString() ?? '-'}
              viewBox={`0 0 256 256`}
            />
          </div>
          <div className="mb-4 flex w-full justify-center">
            <Button
              type="button"
              onClick={() => {
                const printContent = document.getElementById('printQr');
                const WinPrint = window.open('', '', 'width=900,height=650');
                if (WinPrint && printContent) {
                  WinPrint.document.write(
                    `<div style="width:640px;">${printContent.innerHTML}</div>`,
                  );
                  WinPrint.document.close();
                  WinPrint.focus();
                  WinPrint.print();
                  WinPrint.close();
                }
              }}
              className="btn-primary-mint hover:hover-btn-primary-mint"
              disabled={!data?.tag?.id}
            >
              Print QR <MdPrint size={16} className="ml-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReservationDetail;
