import { FC } from 'react';
import { cn } from '@/lib/utils';
import { TChartRanges } from '@/types/api';



type Props = {
  handleViewChange: (view: TChartRanges) => void;
  viewParameter: TChartRanges;
};

const TabSwitch: FC<Props> = ({ handleViewChange, viewParameter }) => {
  return (
    <div className="inline-flex items-center gap-2 col-span-3">
      <div>
        <div className="flex border-rs-v2-thunder-blue rounded-md text-[8px] text-rs-v2-light-grey">
          <button
            type="button"
            className={cn(
              'min-w-[40px] rounded-l-md p-2 hover:bg-rs-v2-dark-grey hover:text-rs-v2-mint',
              viewParameter === 'WEEK' &&
                'bg-rs-v2-dark-grey text-rs-v2-mint',
            )}
            onClick={() => handleViewChange('WEEK')}
          >
            Week
          </button>
          <button
            type="button"
            className={cn(
              'min-w-[40px] rounded-r-md p-2 hover:bg-rs-v2-dark-grey hover:text-rs-v2-mint',
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
              'min-w-[40px] rounded-r-md p-2 hover:bg-rs-v2-dark-grey hover:text-rs-v2-mint',
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
