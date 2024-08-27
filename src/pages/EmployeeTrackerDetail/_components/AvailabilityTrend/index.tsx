import { FC } from 'react';
import { useParams } from 'react-router-dom';

import Card from '@/components/Card';
import { useGetEmpAvailabilityTrendQuery } from '@/stores/employeeTrackerStore/employeeTrackerStoreApi';
import { selectLanguage } from '@/stores/languageStore/languageSlice';
import { localization } from '@/utils/functions/localization';
import useAppSelector from '@/utils/hooks/useAppSelector';
import useWindowDimensions from '@/utils/hooks/useWindowDimension';

import AvailabilityChart from './_components/AvailabilityChart';

type AvailabilityTrendProps = {
  id?: string | null;
};

const AvailabilityTrend: FC<AvailabilityTrendProps> = ({ id }) => {
  const language = useAppSelector(selectLanguage);

  const { width } = useWindowDimensions();

  const { gatewayId } = useParams<'gatewayId'>();
  const { data: trendData } = useGetEmpAvailabilityTrendQuery({
    id: id || '1',
    gatewayId: gatewayId ? Number(gatewayId) : undefined,
  });

  return (
    <Card className="flex h-full w-full flex-col justify-between gap-4 p-5">
      <h1 className="h-fit text-start text-xl">
        {localization('Availability Trend', language)}
      </h1>

      <div className="box-border h-full w-full overflow-x-auto p-2">
        {trendData && <AvailabilityChart key={width} data={trendData} />}
      </div>
    </Card>
  );
};

export default AvailabilityTrend;
