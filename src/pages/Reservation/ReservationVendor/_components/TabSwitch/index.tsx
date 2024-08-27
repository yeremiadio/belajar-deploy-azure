import { FC } from 'react';
import { cn } from '@/lib/utils';

type Props = {
  handleViewChange: (view: 'vendor' |'vehicle' | 'driver') => void;
  viewParameter: string | null;
};

const TabSwitch: FC<Props> = ({ handleViewChange, viewParameter }) => {
  return (
    <div className="inline-flex items-center gap-3 col-span-3">
      <div>
        <div className="flex bg-rs-v2-navy-blue border border-rs-v2-thunder-blue rounded-md text-[13px] text-rs-v2-light-grey">
          <button
            type="button"
            className={cn(
              'min-w-[80px] rounded-l-md p-3 hover:bg-rs-v2-dark-grey hover:text-rs-v2-mint',
              viewParameter === 'vendor' &&
                'bg-rs-v2-dark-grey text-rs-v2-mint',
            )}
            onClick={() => handleViewChange('vendor')}
          >
            Vendor
          </button>
          <button
            type="button"
            className={cn(
              'min-w-[80px] rounded-r-md p-3 hover:bg-rs-v2-dark-grey hover:text-rs-v2-mint',
              viewParameter === 'vehicle' &&
                'bg-rs-v2-dark-grey text-rs-v2-mint',
            )}
            onClick={() => handleViewChange('vehicle')}
          >
            Vehicle
          </button>
          <button
            type="button"
            className={cn(
              'min-w-[80px] rounded-r-md p-3 hover:bg-rs-v2-dark-grey hover:text-rs-v2-mint',
              viewParameter === 'driver' &&
                'bg-rs-v2-dark-grey text-rs-v2-mint',
            )}
            onClick={() => handleViewChange('driver')}
          >
            Driver
          </button>
        </div>
      </div>
    </div>
  );
};

export default TabSwitch;
