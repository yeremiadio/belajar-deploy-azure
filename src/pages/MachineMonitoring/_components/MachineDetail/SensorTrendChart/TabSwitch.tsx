import { FC } from 'react';
import { cn } from '@/lib/utils';
import { TWaterLevelRanges } from '@/types/api/waterLevel';

type Props = {
  handleViewChange: (view: TWaterLevelRanges) => void;
  viewParameter: TWaterLevelRanges;
};

const TabSwitch: FC<Props> = ({ handleViewChange, viewParameter }) => {
  return (
    <div className="inline-flex items-center gap-3 col-span-3">
      <div>
        <div className="flex bg-rs-v2-navy-blue border-rs-v2-thunder-blue rounded-md text-[10px] text-rs-v2-light-grey">
          <button
            type="button"
            className={cn(
              'min-w-[40px] rounded-l-md p-3 hover:bg-rs-v2-dark-grey hover:text-rs-v2-mint',
              viewParameter === 'DAY' &&
                'bg-rs-v2-dark-grey text-rs-v2-mint',
            )}
            onClick={() => handleViewChange('DAY')}
          >
            Day
          </button>
          <button
            type="button"
            className={cn(
              'min-w-[40px] rounded-r-md p-3 hover:bg-rs-v2-dark-grey hover:text-rs-v2-mint',
              viewParameter === 'MONTH' &&
                'bg-rs-v2-dark-grey text-rs-v2-mint',
            )}
            onClick={() => handleViewChange('MONTH')}
          >
            Month
          </button>
          <button
            type="button"
            className={cn(
              'min-w-[40px] rounded-r-md p-3 hover:bg-rs-v2-dark-grey hover:text-rs-v2-mint',
              viewParameter === 'YEAR' &&
                'bg-rs-v2-dark-grey text-rs-v2-mint',
            )}
            onClick={() => handleViewChange('YEAR')}
          >
            Year
          </button>
        </div>
      </div>
    </div>
  );
};

export default TabSwitch;
