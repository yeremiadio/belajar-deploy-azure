import { FC } from 'react';

import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';

type Props = {
  label: string;
  labelStyle?: string;
  required?: boolean;
  direction?: 'row' | 'column';
  gap?: number;
  options: { value: string; label: string }[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  errorMessage?: string;
  onBlur?: React.FocusEventHandler<HTMLDivElement>;
  disabled?: boolean;
};

const InputRadioGroup: FC<Props> = ({
  label,
  labelStyle,
  required = false,
  gap = 4,
  options,
  value,
  onChange,
  errorMessage,
  onBlur,
  disabled,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={label} className="flex">
        <p className={cn(labelStyle ?? 'text-sm text-white')}>{label}</p>
        {required && <div className="text-red-500">*</div>}
      </Label>
      <RadioGroup
        onBlur={onBlur}
        value={value}
        onValueChange={onChange}
        className={cn('flex', `gap-${gap}`)}
        disabled={disabled}
      >
        {options?.map((option, index) => (
          <div className="flex items-center space-x-2" key={index}>
            <RadioGroupItem
              value={option.value}
              id={option.value}
              disabled={disabled}
              className="border-rs-v2-mint [&>span>svg]:fill-rs-v2-mint [&>span>svg]:text-rs-v2-mint"
            />
            <Label htmlFor={option.value}>{option.label}</Label>
          </div>
        ))}
      </RadioGroup>
      {errorMessage && (
        <p className="mt-0.5 text-xs text-red-500">{errorMessage}</p>
      )}
    </div>
  );
};

export default InputRadioGroup;
