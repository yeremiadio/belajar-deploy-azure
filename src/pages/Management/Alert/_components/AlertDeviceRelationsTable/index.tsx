import { useMemo } from 'react';
import { MdOutlineLinkOff } from 'react-icons/md';
import { ColumnDef, Row } from '@tanstack/react-table';
// import TailwindSpinner from '@/components/Spinner/TailwindSpinner';
import DivPropagationWrapper from '@/components/DivPropagationWrapper';
import Modal from '@/components/Modal';
import Spinner from '@/components/Spinner';
import { ExpansionTable } from '@/components/Table/ExpansionTable';
import { Button } from '@/components/ui/button';
import { DrawerClose, DrawerFooter } from '@/components/ui/drawer';
import { useToast } from '@/components/ui/use-toast';

import {
    useGetAlertsRelationDetailsQuery, useRemoveRelationAlertMutation
} from '@/stores/alertStore/alertStoreApi';

import { ErrorMessageBackendDataShape } from '@/types/api';
import { IAlert, IAlertRelation } from '@/types/api/management/alert';
import { IDeviceSensorRelation } from '@/types/api/management/device';

import generateDynamicToastMessage from '@/utils/functions/generateDynamicToastMessage';
import generateStatusCodesMessage from '@/utils/functions/generateStatusCodesMessage';
import { useModal } from '@/utils/hooks/useModal';


const AlertDeviceRelationsTable = ({ original: dataAlert }: Row<IAlert>) => {
  const { data, isLoading, isFetching } = useGetAlertsRelationDetailsQuery(
    { alertId: dataAlert.alertId ?? dataAlert.id },
    { skip: !dataAlert },
  );
  const { toast } = useToast();
  const dataMemo = useMemo<IDeviceSensorRelation[]>(() => {
    if (!data) return [];
    const alertList = data.data.slice();
    return alertList;
  }, [data]);
  const loading = isLoading || isFetching;
  const columns: ColumnDef<IDeviceSensorRelation>[] = [
    {
      accessorKey: 'no',
      header: 'No.',
      maxSize: 10,
      cell: (context) => context.row.index + 1,
    },
    {
      id: 'deviceName',
      header: 'Device Name',
      cell: ({ row }) => row.original?.device?.name ?? '-',
    },
    {
      accessorKey: 'id',
      header: 'Action',
      cell: ({ row: { original: data } }) => {
        const { toggle: toggleUnbindDevice, isShown: isShownUnbindDevice } =
          useModal();
        const [unbindDevice, { isLoading }] = useRemoveRelationAlertMutation();
        const handleUnbindDevice = async () => {
          if (!dataAlert) return;
          const obj: IAlertRelation = {
            alertIds: [dataAlert.id],
            relationIds: [data.id],
          };
          await unbindDevice({ ...obj })
            .unwrap()
            .then(() => {
              toast(
                generateDynamicToastMessage({
                  title: 'Success',
                  description: 'Device unbinded successfully',
                  variant: 'success',
                }),
              );
            })
            .catch((error: ErrorMessageBackendDataShape) => {
              const { title, message } = generateStatusCodesMessage(error.status);
              toast(
                generateDynamicToastMessage({
                  title,
                  description: `${message} "\n${error?.data?.message ?? ''}"`,
                  variant: 'error',
                }),
              );
            });
        };
        return (
          <DivPropagationWrapper>
            <Modal
              title="Unbind Device"
              toggle={toggleUnbindDevice}
              isShown={isShownUnbindDevice}
              description={`Unbind this device ${data.device.name} will remove it from the alert ${dataAlert.name} and will affect alert related to this device.`}
            >
              <DrawerFooter className="flex flex-row justify-end gap-4 pb-0 pt-2">
                <DrawerClose asChild>
                  <Button className="btn-terinary-gray hover:hover-btn-terinary-gray">
                    Cancel
                  </Button>
                </DrawerClose>
                <DrawerClose asChild>
                  <Button
                    onClick={handleUnbindDevice}
                    disabled={isLoading}
                    className="btn-primary-danger hover:hover-btn-primary-danger disabled:disabled-btn-disabled-slate-blue"
                  >
                    {isLoading ? (
                      <Spinner
                        size={18}
                        borderWidth={1.5}
                        isFullWidthAndHeight
                      />
                    ) : (
                      'Unbind'
                    )}
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </Modal>
            <Button
              onClick={() => toggleUnbindDevice()}
              className="bg-transparent p-[5px] text-rs-v2-red hover:bg-rs-v2-red hover:text-white"
            >
              <MdOutlineLinkOff size={24} />
            </Button>
          </DivPropagationWrapper>
        );
      },
    },
  ];
  return loading ? (
    <div className="flex items-center justify-center p-2">
      <Spinner size={24} borderWidth={3} isFullWidthAndHeight={false} />
    </div>
  ) : (
    <ExpansionTable isShowNumbering columns={columns} data={dataMemo} />
  );
};

export default AlertDeviceRelationsTable;
