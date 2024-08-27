import {
  FC,
  HTMLAttributes,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import { cn } from '@/lib/utils';

import { selectLanguage } from '@/stores/languageStore/languageSlice';

import useAppSelector from '@/utils/hooks/useAppSelector';
import { localization } from '@/utils/functions/localization';

interface Props {
  value: number;
  maxValue: number;
  isOverThreshold: boolean;
  isWarning?: boolean;
}

export const WaveLiquid: FC<Props & HTMLAttributes<HTMLDivElement>> = ({
  value,
  maxValue,
  className,
  isOverThreshold,
  isWarning,
  ...rest
}) => {
  const language = useAppSelector(selectLanguage);

  const divRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState<number>(0);
  const [percentWave, setPercentWave] = useState<number>(0);

  useLayoutEffect(() => {
    const div = divRef.current;
    if (div) setWidth(div.getBoundingClientRect().width);
  }, []);

  useEffect(() => {
    const percent = (value / maxValue) * 100;
    setPercentWave(percent);
  }, [value, maxValue]);

  return (
    <div
      ref={divRef}
      className={cn(
        `relative flex items-center justify-center rounded-full border-4 p-2`,
        className,
        isOverThreshold
          ? 'border-rs-v2-red'
          : isWarning
            ? 'border-rs-alert-yellow'
            : 'border-rs-alert-green',
      )}
      {...rest}
      style={{
        height: `${width}px`,
      }}
    >
      <div
        className={cn(
          `relative box-border h-full w-full overflow-hidden rounded-full bg-transparent`,
        )}
      >
        <div
          className={cn(
            'wave absolute -left-[50%] h-[200%] w-[200%] -translate-x-1/2 rounded-[40%]',
            isOverThreshold
              ? 'bg-rs-v2-red'
              : isWarning
                ? 'bg-rs-alert-yellow'
                : 'bg-rs-alert-green',
            percentWave && percentWave > 0 && 'animate-liquid-wave ',
          )}
          style={{
            top: `calc(100% - ${percentWave}%)`,
            transition: 'top 1s',
          }}
        >
          {/* note for logic soon: top -200% (highest) && top -100% (lowest) */}
          {/* the size of the wave is 2 times larger than the container */}
        </div>
      </div>

      <div className="absolute left-1/2 top-1/2 flex w-fit -translate-x-1/2 -translate-y-1/2 flex-col">
        <h1 className="text-xl font-bold">
          {value ? (value < 0 ? 0 : value) : 0}
          <span className="text-xs font-medium">/{maxValue}</span>
        </h1>
        <p className="text-xs font-medium">
          {localization('Centimeter', language)}
        </p>
      </div>
    </div>
  );
};
