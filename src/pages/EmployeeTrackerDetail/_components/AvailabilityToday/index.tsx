import { FC } from 'react';
import { useParams } from 'react-router-dom';

import Card from '@/components/Card';
import { useGetEmpAvailabilityQuery } from '@/stores/employeeTrackerStore/employeeTrackerStoreApi';
import { selectLanguage } from '@/stores/languageStore/languageSlice';
import { localization } from '@/utils/functions/localization';
import useAppSelector from '@/utils/hooks/useAppSelector';

import CircularAvailabilityChart from './_components/CircularAvailabilityChart';

type AvailabilityTodayProps = {
  id?: string | null;
};

const formatTime = (time: string) => time.replace('h', 'h ');

const AvailabilityToday: FC<AvailabilityTodayProps> = ({ id }) => {
  const language = useAppSelector(selectLanguage);

  const { gatewayId } = useParams<'gatewayId'>();
  const { data } = useGetEmpAvailabilityQuery({
    id: id || '1',
    gatewayId: gatewayId ? Number(gatewayId) : undefined,
  });

  const calculateAvailability = (
    inWorkingStation: string,
    totalHours: number,
  ) => {
    const hoursInWorkingStation = parseInt(inWorkingStation.split('h')[0]);
    return (hoursInWorkingStation / totalHours) * 100;
  };

  return (
    <Card className="flex h-full flex-col gap-4 p-5">
      <h1 className="h-fit text-start text-xl">
        {localization('Availability (Today)', language)}
      </h1>

      <div className="flex h-full flex-col items-center justify-center gap-2">
        <div className="flex w-full items-center justify-center">
          <CircularAvailabilityChart
            value={calculateAvailability(data?.inWorkingStation || '0h', 8)}
          />
        </div>

        <div className="flex h-fit w-full flex-col gap-2">
          <div className="flex justify-between">
            <p>{localization('In Working Station', language)}</p>
            <p className="font-bold">
              {data ? formatTime(data.inWorkingStation) : '-'}
            </p>
          </div>
          <div className="flex justify-between">
            <p>{localization('Late', language)}</p>
            <p className="font-bold">{data ? formatTime(data.late) : '-'}</p>
          </div>
          <div className="flex justify-between">
            <p>{localization('Overtime', language)}</p>
            <p className="font-bold">
              {data ? formatTime(data.overtime) : '-'}
            </p>
          </div>
          <div className="flex justify-between">
            <p>{localization('Location Anomaly', language)}</p>
            <p className="font-bold">
              {data ? formatTime(data.locationAnomaly) : '-'}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AvailabilityToday;
