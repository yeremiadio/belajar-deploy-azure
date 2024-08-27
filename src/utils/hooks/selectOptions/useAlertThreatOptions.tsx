import { cn } from '@/lib/utils';
import { BasicSelectOpt } from '@/types/global';

const defaultDotStyle = 'rounded-full h-[1.25rem] w-[1.25rem] inline-block';

type ThreatOptions = BasicSelectOpt<number>[];
const useAlertThreatOptions = (): { arr: ThreatOptions } => {
  const values: ThreatOptions = [
    {
      value: 1,
      label: (
        <div
          title="Threat level 1"
          style={{ background: '#FBC357' }}
          className={cn(defaultDotStyle, 'bg-[#FBC357]')}
        />
      ),
    },
    {
      value: 2,
      label: (
        <div
          title="Threat level 2"
          style={{ background: '#F05454' }}
          className={cn(defaultDotStyle, 'bg-[#FBC357]')}
        />
      ),
    },
  ];
  return { arr: values };
};

export default useAlertThreatOptions;
