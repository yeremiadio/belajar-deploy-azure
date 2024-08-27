import { FC } from 'react';

import { cn } from '@/lib/utils';

import { TEmployeeDetail } from '@/types/api/employeeTracker';

import Card from '@/components/Card';

import useAppSelector from '@/utils/hooks/useAppSelector';
import { localization } from '@/utils/functions/localization';

import { selectLanguage } from '@/stores/languageStore/languageSlice';

type EmployeeIdentityProps = {
  data?: TEmployeeDetail;
};

const EmployeeIdentity: FC<EmployeeIdentityProps> = ({ data }) => {
  const language = useAppSelector(selectLanguage);

  const WorkingAreaPill = (
    id: number,
    location: string,
    status: 'normal' | 'warn' | 'alert',
  ) => {
    return (
      <div key={id} className="rounded-2xl bg-rs-v2-space/50">
        <p
          className={cn(
            'px-2 py-1 text-sm font-bold',
            status === 'normal' && 'text-rs-azure-blue',
            status === 'warn' && 'text-rs-alert-yellow',
            status === 'alert' && 'text-rs-v2-red',
          )}
        >
          {location}
        </p>
      </div>
    );
  };

  const InfoCard = (title: string, value: number, color = '') => {
    return (
      <div className="flex flex-col justify-between overflow-auto rounded-xl bg-rs-v2-galaxy-blue p-3 px-4 text-start">
        <p>{localization(title, language)}</p>
        <p className={`text-3xl font-bold ${color}`}>{value}</p>
      </div>
    );
  };

  return (
    <Card className="grid h-full grid-cols-1 gap-4 p-5">
      <h1 className="h-fit text-start text-xl">
        {localization('Employee Identity', language)}
      </h1>

      <div className="flex h-full w-full flex-col gap-2 rounded-xl bg-rs-v2-galaxy-blue p-3 px-4">
        <div className="flex justify-between">
          <p className="font-bold">{localization('Gender', language)}</p>
          <p>{data?.gender || '-'}</p>
        </div>
        <div className="flex justify-between">
          <p className="font-bold">Tag Device</p>
          <p>{data?.tagDevice || '-'}</p>
        </div>
        <div className="flex justify-between">
          <p className="font-bold">{localization('Local Address', language)}</p>
          <p>{data?.address || '-'}</p>
        </div>
        <div className="flex flex-col items-start">
          <p className="pb-3 font-bold">
            {localization('Working Area', language)}
          </p>
          <div className="flex w-full flex-row gap-x-2 overflow-auto">
            {data?.workingArea?.map((area, index) =>
              WorkingAreaPill(index, area, 'normal'),
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-flow-row gap-4 sm:grid-cols-3">
        {InfoCard('Attendance', data?.attendance || 0)}
        {InfoCard('Leaves', data?.leave || 0, 'text-rs-alert-yellow')}
        {InfoCard('Late', data?.late || 0)}
      </div>
    </Card>
  );
};

export default EmployeeIdentity;
