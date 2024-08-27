import { ComponentProps } from 'react';

import { cn } from '@/lib/utils';

import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface ISliderProps extends Omit<ComponentProps<typeof Slider>, 'onChange'> {
  containerClassName?: string;
  label?: string;
  required?: boolean;
  onChange?: (value: number[]) => void;
}

const SliderComponent = ({
  className,
  required,
  containerClassName,
  label,
  onChange,
  value,
  defaultValue,
  ...rest
}: ISliderProps) => {
  return (
    <div className={cn('grid w-full items-center gap-2', containerClassName)}>
      {label && (
        <Label htmlFor={label} className="flex">
          <p className="text-sm text-white">{label}</p>
          {required && <div className="text-red-500">*</div>}
        </Label>
      )}
      <div className="grid grid-cols-12 gap-2">
        <Slider
          defaultValue={defaultValue}
          max={100}
          value={value}
          onValueChange={onChange}
          step={1}
          className={cn('col-span-11 w-full', className)}
          {...rest}
        />

        <div className="col-span-1 ">
          <div
            title={String(value) + '%'}
            className="flex w-[36px] items-center justify-center bg-rs-v2-galaxy-blue px-2 py-1 text-xs"
          >
            {value}%
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12">
        <div className="col-span-11 flex items-center justify-between">
          <div className="text-xs">0%</div>
          <div className="text-xs">100%</div>
        </div>
      </div>
    </div>
  );
};

export default SliderComponent;
