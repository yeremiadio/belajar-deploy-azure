import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import Card from '@/components/Card';
import GreenDot from '@/components/Dot/GreenDot';

import { selectLanguage } from '@/stores/languageStore/languageSlice';
import { useGetEnviroboxDeviceSummaryQuery } from '@/stores/enviroboxStore/enviroboxStoreApi';

import { TSocketGateway } from '@/types/api/socket';

import { cn } from '@/lib/utils';

import { localization } from '@/utils/functions/localization';
import useAppSelector from '@/utils/hooks/useAppSelector';

type Props = {
  socket: TSocketGateway | null;
};

const DeviceSummary = ({ socket }: Props) => {
  const { gatewayId } = useParams<'gatewayId'>();
  const { data: deviceSummary, refetch: refetchDeviceSummary } =
    useGetEnviroboxDeviceSummaryQuery({
      gatewayId: gatewayId ? Number(gatewayId) : undefined,
    });
  const language = useAppSelector(selectLanguage);

  useEffect(() => {
    if (!socket) return;
    refetchDeviceSummary();
  }, [socket, refetchDeviceSummary]);

  return (
    <div className="h-fit" data-testid="device-summary-envirobox">
      <h2 className="mb-4 text-xl">
        {localization('Device Summary', language)}
      </h2>
      <Card
        className={cn(
          'grid w-auto grid-cols-3 gap-y-3 overflow-x-auto rounded-md border-0 bg-rs-dark-card2 px-4 py-2 text-center shadow-[0px_2px_8px_0px_rgba(0,0,0,0.15)] sm:max-h-24 sm:grid-cols-5 lg:py-4',
        )}
      >
        <div className="flex flex-col flex-wrap items-center justify-center gap-2">
          <div className="flex items-center gap-1">
            <p className="text-sm">{localization('Active', language)}</p>
            <GreenDot />
          </div>
          <p className="text-xl font-bold">{deviceSummary?.active ?? 0}</p>
        </div>
        <div className="flex flex-col items-center justify-center gap-2">
          <p className="text-sm">{localization('Inactive', language)}</p>

          <p className="text-xl font-bold">{deviceSummary?.inactive ?? 0}</p>
        </div>
        <div className="flex flex-col items-center justify-center gap-2">
          <p className="text-sm">{localization('Total Device', language)}</p>
          <p className="text-xl font-bold">{deviceSummary?.totalDevice ?? 0}</p>
        </div>
        <div className="flex flex-col items-center justify-center gap-2 text-rs-alert-yellow">
          <p className="text-sm">{localization('Warning', language)}</p>
          <p className="text-xl font-bold">{deviceSummary?.warning ?? 0}</p>
        </div>
        <div className="flex flex-col items-center justify-center gap-2 text-rs-v2-red">
          <p className="text-sm">{localization('Critical', language)}</p>
          <p className="text-xl font-bold">{deviceSummary?.critical ?? 0}</p>
        </div>
      </Card>
    </div>
  );
};

export default DeviceSummary;
