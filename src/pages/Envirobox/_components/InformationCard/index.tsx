import { FC } from 'react';

import { TGatewayDevice } from '@/types/api/socket';

import { getSensorData } from '@/utils/functions/getSensorData';

import InformationWrapper from '../InformationWrapper';

type Props = {
  deviceData: TGatewayDevice;
};

const InformationCard: FC<Props> = ({ deviceData }) => {
  const isDeviceActive = deviceData?.status === 1;

  return (
    <div className="mt-5 flex flex-col gap-2 rounded-xl bg-rs-v2-galaxy-blue p-4">
      {deviceData?.sensorlog?.data?.map((sensor, index) => {
        const { Icon, name, unit } = getSensorData(sensor?.sensorcode);
        const haveThreatLevel2 = sensor?.alert?.threatlevel === 2;
        const haveThreatLevel1 = sensor?.alert?.threatlevel === 1;
        return (
          <InformationWrapper
            isCritical={haveThreatLevel2}
            isWarning={haveThreatLevel1}
            key={index}
          >
            <div className="flex items-center gap-1 truncate">
              {Icon && <Icon size={20} className="flex-shrink-0" />}
              <p className="text-rs-v2-white min-w-0 truncate">{name}</p>
            </div>
            <p className="text-rs-v2-white flex-shrink-0 ">
              {isDeviceActive ? sensor?.value + ` ${unit}` : '-'}
            </p>
          </InformationWrapper>
        );
      })}
    </div>
  );
};

export default InformationCard;
