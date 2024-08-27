import dayjs from 'dayjs';
import { ChangeEventHandler, useEffect, useState } from 'react';
import { MdCalendarMonth } from 'react-icons/md';

import { Label } from '@/components/ui/label';
import { convertToDateOrNull } from '@/utils/functions/dateFormat';

import InputComponent from '../InputComponent';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

type Props = {
  value: Date | undefined;
  onChange: (value: Date | null) => void;
  placeholder?: string | undefined;
  label?: string;
  disabled?: boolean;
  required?: boolean;
  onBlur?: () => void;
};

const InputDateTimePicker = ({
  value,
  onChange,
  placeholder,
  label,
  disabled,
  required,
  onBlur,
}: Props) => {
  const [selected, setSelected] = useState<Date | undefined>(
    convertToDateOrNull(value) || undefined,
  );
  const [timeValue, setTimeValue] = useState<string>('12:00');

  useEffect(() => {
    setSelected(convertToDateOrNull(value) || undefined);
  }, [value]);

  const handleTimeChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setTimeValue(e.target.value);
    if (selected) {
      const newDate = new Date(selected);
      newDate.setHours(
        +e.target.value.split(':')[0],
        +e.target.value.split(':')[1],
      );
      setSelected(newDate);
      onChange(newDate);
    }
  };

  const handleDaySelect = (date: Date | undefined) => {
    setSelected(date || undefined);
    if (date) {
      const updatedDate = new Date(date);
      if (timeValue) {
        updatedDate.setHours(
          +timeValue.split(':')[0],
          +timeValue.split(':')[1],
        );
      }
      onChange(updatedDate);
    } else {
      onChange(null); // Set to null if date is not selected
    }
  };

  return (
    <div className="grid w-full items-center gap-2">
      {label ? (
        <Label htmlFor={label} className="flex">
          <p className="text-sm text-white">{label}</p>
          {required && <div className="text-red-500">*</div>}
        </Label>
      ) : null}

      <Popover>
        <PopoverTrigger asChild>
          <div className="w-full">
            <InputComponent
              disabled={disabled}
              placeholder={placeholder}
              value={dayjs(value).format('YYYY-MM-DD, HH:mm:ss')}
              readOnly
              containerStyle="items-start w-full inline-block"
              inputStyle="w-full"
              className="min-h-[40px] rounded-[4px] border-rs-v2-galaxy-blue bg-rs-v2-galaxy-blue px-4 py-4 text-white placeholder:text-rs-neutral-dark-platinum focus-visible:bg-rs-v2-galaxy-blue focus-visible:ring-0 focus-visible:ring-offset-0 hover:enabled:border-rs-v2-mint focus:enabled:border-rs-v2-mint  active:enabled:border-rs-v2-mint disabled:border-rs-v2-slate-blue disabled:bg-rs-v2-slate-blue disabled:text-rs-v2-gunmetal-blue disabled:opacity-100 placeholder:disabled:text-rs-v2-gunmetal-blue"
              endContent={
                <MdCalendarMonth className="h-[18px] w-[18px] text-rs-neutral-steel-gray" />
              }
            />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            className="rounded-sm bg-rs-v2-dark-grey"
            selected={value}
            onSelect={handleDaySelect}
            onDayBlur={onBlur}
            initialFocus
            footer={
              <InputComponent
                type="time"
                className="mt-4"
                value={timeValue}
                onChange={handleTimeChange}
              />
            }
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default InputDateTimePicker;
