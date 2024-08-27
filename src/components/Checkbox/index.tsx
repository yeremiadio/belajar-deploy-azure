import { cn } from '@/lib/utils';
import { InputHTMLAttributes } from 'react';
import { Label } from '../ui/label';

type Props = {
  label?: string;
  textStyle?: string;
  labelContainer?: string;
  labelStyle?: string;
  required?: boolean;
} & InputHTMLAttributes<HTMLInputElement>;

const Checkbox = ({
  disabled,
  label,
  textStyle,
  labelContainer,
  labelStyle,
  required,
  id,
  ...rest
}: Props) => {
  return (
    <div className={cn(label ? 'flex flex-col gap-2' : 'flex')}>
      <Label htmlFor={label} className="flex">
        <p className={cn(labelStyle ?? 'text-sm text-white')}>
          {labelContainer}
        </p>
        {required && <div className="text-red-500">*</div>}
      </Label>
      <div className={cn('flex flex-row', disabled && 'opacity-50')}>
        <label
          className={cn(
            'relative flex cursor-pointer items-center rounded-md p-1',
            disabled && 'cursor-not-allowed',
          )}
          htmlFor={id}
        >
          <input
            type="checkbox"
            id={id}
            className={cn(
              'peer relative h-5 w-5 cursor-pointer appearance-none rounded-sm border-2 border-white bg-none transition-all checked:border-rs-v2-mint checked:bg-none',
              disabled && 'cursor-not-allowed',
            )}
            {...rest}
            disabled={disabled}
          />
          <div className="pointer-events-none absolute left-[46%] top-[42%] -translate-x-1/2 -translate-y-1/2 text-rs-v2-mint opacity-0 transition-opacity peer-checked:opacity-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5"
              viewBox="0 0 16 16"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth={1}
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </label>
        {label ? (
          <label
            htmlFor={id}
            className={cn('pl-[4px] pt-[4px] text-sm', textStyle)}
          >
            {label}
          </label>
        ) : null}
      </div>
    </div>
  );
};

export default Checkbox;
