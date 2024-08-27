import { FC } from 'react';

import { cn } from '@/lib/utils';
import { selectLanguage } from '@/stores/languageStore/languageSlice';
import { TSensorData } from '@/types/api/socket';
import { localization } from '@/utils/functions/localization';
import useAppSelector from '@/utils/hooks/useAppSelector';

interface Props {
  title: string;
  sensor: TSensorData | undefined;
}

export const StatisticCard: FC<Props> = ({ title, sensor }) => {
  const language = useAppSelector(selectLanguage);

  return (
    <div className="flex w-[33.33%] flex-row items-center gap-x-3 md:gap-1 lg:flex-col">
      <h4 className="whitespace-nowrap text-xs font-normal md:text-xs lg:text-sm xl:text-base 2xl:text-lg">
        {localization(title, language)}
      </h4>
      <h2
        className={cn(
          'whitespace-nowrap text-lg font-semibold md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl',
          sensor?.alert?.threatlevel === 2 && 'text-rs-v2-red',
          sensor?.alert?.threatlevel === 1 && 'text-rs-alert-yellow',
        )}
      >
        {sensor?.value ?? 0}{' '}
        <span className="text-[10px] md:text-[10px] lg:text-xs xl:text-sm 2xl:text-base">
          {sensor?.unit ?? ''}
        </span>
      </h2>
    </div>
  );
};
