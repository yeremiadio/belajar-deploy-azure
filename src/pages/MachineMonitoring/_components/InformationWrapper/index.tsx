import { FC } from 'react';

import { cn } from '@/lib/utils';

type Props = {
  isWarning: boolean;
  isCritical: boolean;
  isActive: boolean;
  children: React.ReactNode;
};

const InformationWrapper: FC<Props> = ({ isWarning, isCritical, isActive,  children }) => {
  return (
    <div
      className={cn(
        'flex justify-between text-xs',
        isCritical && 'text-rs-v2-red',
        isWarning && 'text-rs-alert-yellow',
        !isActive && 'text-rs-v2-silver',
      )}
    >
      {children}
    </div>
  );
};

export default InformationWrapper;
