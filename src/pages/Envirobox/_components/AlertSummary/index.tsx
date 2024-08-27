import { useParams } from 'react-router-dom';

import Card from '@/components/Card';
import { cn } from '@/lib/utils';
import { useGetEnviroboxDeviceSummaryQuery } from '@/stores/enviroboxStore/enviroboxStoreApi';
import { selectLanguage } from '@/stores/languageStore/languageSlice';
import { localization } from '@/utils/functions/localization';
import useAppSelector from '@/utils/hooks/useAppSelector';

const AlertSummary = () => {
  const { gatewayId } = useParams<'gatewayId'>();
  const { data: alertSumary } = useGetEnviroboxDeviceSummaryQuery({
    gatewayId: gatewayId ? Number(gatewayId) : undefined,
  });
  const language = useAppSelector(selectLanguage);

  return (
    <div className="h-fit">
      <h2 className="mb-4 text-xl">
        {localization('Alert Summary', language)}
      </h2>

      <Card
        className={cn(
          'grid max-h-24 w-auto grid-cols-2 overflow-x-auto rounded-md border-0 bg-rs-dark-card2 px-4 py-2 text-center shadow-[0px_2px_8px_0px_rgba(0,0,0,0.15)] lg:py-4',
        )}
      >
        <div className="flex flex-col items-center justify-center gap-2 text-rs-alert-yellow">
          <div className="flex items-center gap-1">
            <p className="text-sm">{localization('Warning', language)}</p>
          </div>
          <p className="text-xl font-bold">{alertSumary?.warning ?? 0}</p>
        </div>
        <div className="flex flex-col items-center justify-center gap-2 text-rs-v2-red">
          <p className="text-sm">{localization('Critical', language)}</p>
          <p className="text-xl font-bold">{alertSumary?.critical ?? 0}</p>
        </div>
      </Card>
    </div>
  );
};

export default AlertSummary;
