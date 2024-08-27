import { FC, HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/lib/utils';
import { selectLanguage } from '@/stores/languageStore/languageSlice';
import { localization } from '@/utils/functions/localization';
import useAppSelector from '@/utils/hooks/useAppSelector';

interface Props {
  border: boolean;
  title: string;
  children: ReactNode;
}

export const Card: FC<Props & HTMLAttributes<HTMLDivElement>> = ({
  border,
  title,
  className,
  children,
  ...rest
}) => {
  const language = useAppSelector(selectLanguage);
  return (
    <div
      className={cn(
        `box-border overflow-hidden p-6 rounded-xl flex flex-col h-[300px] lg:h-auto`,
        border ? "border-2 border-rs-v2-thunder-blue bg-rs-v2-navy-blue" : "",
        className
      )}
      {...rest}
    >
      <h1 className="text-lg md:text-xl font-medium text-rs-neutral-silver-lining">
        {localization(title, language)}
      </h1>
      <div className="box-border overflow-hidden mt-6 h-full">{children}</div>
    </div>
  );
};
