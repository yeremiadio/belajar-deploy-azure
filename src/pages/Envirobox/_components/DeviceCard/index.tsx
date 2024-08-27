import { FC } from 'react';
import { MdOutlineLocationOn } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

import { cn } from '@/lib/utils';

import useDynamicLastUpdateTime from '@/utils/hooks/useDynamicLastUpdateTime';
import { ROUTES } from '@/utils/configs/route';

import Card from '@/components/Card';
import { Button } from '@/components/ui/button';

import { TGatewayDevice } from '@/types/api/socket';

import InformationCard from '../InformationCard';

type Props = {
  deviceData: TGatewayDevice;
  selected: boolean;
  onClick: () => void;
  gatewayId?: string;
};

const DeviceCard: FC<Props> = ({
  selected = false,
  onClick,
  deviceData,
  gatewayId,
}) => {
  const receivedOn = deviceData?.sensorlog?.receivedon;
  const lastUpdateTime = useDynamicLastUpdateTime({ receivedOn });

  const navigate = useNavigate();

  const handleViewDetail = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.stopPropagation();
    navigate(
      gatewayId
        ? ROUTES.enviroboxGatewayDetail(gatewayId, deviceData.id.toString())
        : ROUTES.enviroboxDetail(deviceData.id.toString()),
    );
  };

  return (
    <Card
      className={cn(
        'relative box-border h-fit cursor-pointer p-6',
        !deviceData?.status && 'cursor-default opacity-70',
        selected && 'env-selected border border-white',
      )}
      onClick={onClick}
    >
      <div
        className="flex flex-col justify-between gap-2"
        data-testid={deviceData?.name}
      >
        {deviceData?.name}
        <div className="flex items-center gap-2">
          <MdOutlineLocationOn size={18} />
          {deviceData?.location?.name ?? '-'}
        </div>
      </div>
      <span
        className={cn(
          'absolute right-6 top-6 block h-4 w-4 rounded-full shadow-[0px_0px_6px_rs-accent-green] shadow-rs-v2-green-4',
          deviceData?.status
            ? 'bg-rs-alert-green'
            : 'bg-rs-v2-grey-disable shadow-none',
        )}
      ></span>
      <InformationCard deviceData={deviceData} />
      <Button
        type="button"
        className="btn-secondary-midnight-blue hover:hover-btn-secondary-midnight-blue disabled:disabled-btn-disabled-slate-blue mt-4 w-full"
        role="button"
        onClick={(e) => handleViewDetail(e)}
      >
        View Detail
      </Button>
      <p className="mt-3 text-center text-sm font-semibold italic text-rs-neutral-chromium">
        {lastUpdateTime}
      </p>
    </Card>
  );
};

export default DeviceCard;
