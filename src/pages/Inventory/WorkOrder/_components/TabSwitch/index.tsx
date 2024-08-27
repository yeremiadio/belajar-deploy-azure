import { FC } from 'react';

import { cn } from '@/lib/utils';

type Props = {
  handleViewChange: (view: 'active' | 'completed') => void;
  viewParameter: string | null;
};

const TabSwitch: FC<Props> = ({ handleViewChange, viewParameter }) => {
  return (
    <div className="col-span-8 inline-flex items-center gap-3">
      <div>
        <div className="flex rounded-md border border-rs-v2-thunder-blue bg-rs-v2-navy-blue text-[14px] text-rs-v2-light-grey">
          <button
            type="button"
            className={cn(
              'min-w-[120px] rounded-l-md p-3 text-[14px] hover:bg-rs-v2-dark-grey hover:text-rs-v2-mint',
              viewParameter === 'active' &&
                'bg-rs-v2-dark-grey text-rs-v2-mint',
            )}
            onClick={() => handleViewChange('active')}
          >
            Active
          </button>
          <button
            type="button"
            className={cn(
              'min-w-[120px] rounded-r-md p-3 text-[14px] hover:bg-rs-v2-dark-grey hover:text-rs-v2-mint',
              viewParameter === 'completed' &&
                'bg-rs-v2-dark-grey text-rs-v2-mint',
            )}
            onClick={() => handleViewChange('completed')}
          >
            Completed
          </button>
        </div>
      </div>
    </div>
  );
};

export default TabSwitch;
