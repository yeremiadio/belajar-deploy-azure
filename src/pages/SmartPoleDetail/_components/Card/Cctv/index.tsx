import { FC } from 'react';
import { useParams } from 'react-router-dom';

import { CctvVideo } from '@/assets/videos';

import { selectLanguage } from '@/stores/languageStore/languageSlice';
import { useGetCctvDeviceSmartPoleQuery } from '@/stores/smartPoleStore/smartPoleStoreApi';

import { localization } from '@/utils/functions/localization';
import useAppSelector from '@/utils/hooks/useAppSelector';

interface Props {}

export const Cctv: FC<Props> = () => {
  const language = useAppSelector(selectLanguage);
  const { id: smart_pole_id } = useParams<'id'>();
  const { gatewayId } = useParams<'gatewayId'>();

  const { data } = useGetCctvDeviceSmartPoleQuery(
    {
      id: smart_pole_id ? Number(smart_pole_id) : undefined,
      gatewayId: gatewayId ? Number(gatewayId) : undefined,
    },
    {
      skip: !smart_pole_id || !gatewayId,
    },
  );

  return (
    <div className="box-border flex h-[300px] flex-col overflow-hidden rounded-xl p-6 pb-0 pt-0 md:pt-6 xl:h-auto">
      <h1 className="text-lg font-medium text-rs-neutral-silver-lining md:text-xl 2xl:text-2xl">
        {localization('CCTV', language)}:{' '}
        <span className="text-rs-alert-green">ON</span>
      </h1>

      <div className="relative mt-6 box-border h-full w-full overflow-hidden bg-slate-950">
        {data?.status === true ? (
          // <StreamVideo className="w-full h-full" stream_url={CctvVideo} />
          <iframe
            title="Video Player"
            className="h-full w-full"
            src={CctvVideo}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ">
            <p className="text-xl font-semibold">VIDEO LOSS</p>
          </div>
        )}
      </div>
    </div>
  );
};
