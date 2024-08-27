import dayjs from 'dayjs';
import { MdCalendarMonth } from 'react-icons/md';

import { cn } from '@/lib/utils';

import InputComponent from '@/components/InputComponent';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

type Props = {
  value: Date | undefined;
  onBlur?: () => void;
  onChange: (value: Date | null) => void;
  placeholder?: string | undefined;
  label?: string;
  disabled?: boolean;
  errorMessage?: string;
  labelStyle?: string;
  required?: boolean;
  disabledCalendar?: { before: Date } | ((date: Date) => boolean);
  className?: string;
  containerClassName?: string;
};

const InputDatePickerComponent = ({
  value,
  onBlur,
  onChange,
  placeholder,
  label,
  disabled,
  errorMessage,
  labelStyle,
  required,
  disabledCalendar,
  className,
  containerClassName,
}: Props) => {
  const handleDaySelect = (date: Date | undefined) => {
    onChange(date || null);
  };

  return (
    <div className={cn('grid w-full items-center gap-2', containerClassName)}>
      {label ? (
        <Label htmlFor={label} className="flex">
          <p className={cn(labelStyle ?? 'text-sm text-white')}>{label}</p>
          {required && <div className="text-red-500">*</div>}
        </Label>
      ) : null}
      <Popover>
        <PopoverTrigger asChild>
          <div className="w-full">
            <InputComponent
              disabled={disabled}
              placeholder={placeholder}
              value={value ? dayjs(value).format('YYYY-MM-DD') : ''}
              readOnly
              containerStyle="items-start w-full inline-block"
              inputStyle="w-full"
              className={cn(
                'min-h-[40px] rounded-[4px] border-rs-v2-galaxy-blue bg-rs-v2-galaxy-blue px-4 py-4 text-white placeholder:text-rs-neutral-dark-platinum focus-visible:bg-rs-v2-galaxy-blue focus-visible:ring-0 focus-visible:ring-offset-0 hover:enabled:border-rs-v2-mint focus:enabled:border-rs-v2-mint  active:enabled:border-rs-v2-mint disabled:border-rs-v2-slate-blue disabled:bg-rs-v2-slate-blue disabled:text-rs-v2-gunmetal-blue disabled:opacity-100 placeholder:disabled:text-rs-v2-gunmetal-blue',
                className,
              )}
              endContent={
                <MdCalendarMonth className="h-[18px] w-[18px] text-rs-neutral-steel-gray" />
              }
            />
          </div>
        </PopoverTrigger>
        {errorMessage && (
          <p className="mt-0.5 text-xs text-red-500">{errorMessage}</p>
        )}
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            className="rounded-sm bg-rs-v2-dark-grey"
            selected={value}
            onSelect={handleDaySelect}
            onDayBlur={onBlur}
            disabled={disabledCalendar}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default InputDatePickerComponent;
