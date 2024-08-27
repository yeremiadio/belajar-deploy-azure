import { FC } from 'react';

import { cn } from '@/lib/utils';

type Props = {
  isWarning: boolean;
  isCritical: boolean;
  children: React.ReactNode;
};

const InformationWrapper: FC<Props> = ({ isWarning, isCritical, children }) => {
  const isAlert = isWarning || isCritical;

  return (
    <div
      className={cn(
        'flex justify-between py-2.5',
        isWarning && 'bg-rs-alert-bg-yellow text-rs-alert-yellow',
        isCritical && ' bg-rs-v2-red-bg text-rs-v2-red',
        isAlert && 'rounded-[0.5rem] px-3',
      )}
    >
      {children}
    </div>
  );
};

export default InformationWrapper;
