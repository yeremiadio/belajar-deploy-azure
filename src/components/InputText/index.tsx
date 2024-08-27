import React from 'react';

import { Input, InputProps } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const InputText = React.forwardRef<
  HTMLInputElement,
  InputProps & {
    label: string;
    endContent?: JSX.Element;
    errorMessage?: string;
  }
>(
  (
    { value, onBlur, onChange, label, endContent, errorMessage, ...rest },
    ref,
  ) => {
    return (
      <div className="grid w-full items-center gap-2.5">
        <Label htmlFor={label}>
          <p className="text-md text-white">{label}</p>
        </Label>
        <div className="border-5 relative flex items-center">
          <Input
            id={label}
            ref={ref}
            className="rounded-sm border-rs-v2-thunder-blue bg-rs-v2-galaxy-blue text-white hover:border-rs-v2-mint hover:bg-rs-v2-galaxy-blue focus:border-rs-v2-mint focus:bg-rs-v2-galaxy-blue focus-visible:bg-rs-v2-galaxy-blue focus-visible:ring-0 focus-visible:ring-offset-0 active:border-rs-v2-mint active:bg-rs-v2-galaxy-blue"
            value={value}
            onBlur={onBlur}
            onChange={onChange}
            {...rest}
          />
          {endContent && (
            <span className="absolute right-4 cursor-pointer">
              {endContent}
            </span>
          )}
        </div>
        {errorMessage && <p className="text-xs text-red-500">{errorMessage}</p>}
      </div>
    );
  },
);

export default InputText;
