import { Input, InputProps } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { cn } from '@/lib/utils';

const InputComponent = ({
  className,
  value,
  onBlur,
  onChange,
  required,
  label,
  endContent,
  errorMessage,
  inputStyle,
  labelStyle,
  name,
  containerStyle,
  additionalLabel,
  helperText,
  helperClassname,
  id,
  ...rest
}: {
  label?: string;
  endContent?: JSX.Element;
  errorMessage?: string;
  textStyle?: string;
  inputStyle?: string;
  labelStyle?: string;
  containerStyle?: string;
  helperText?: string;
  additionalLabel?: string;
  helperClassname?: string;
  name?: string;
} & InputProps) => (
  <div className={cn(containerStyle ?? 'grid w-full items-center gap-2')}>
    {label ? (
      <Label htmlFor={label} className="flex">
        <p className={cn('text-sm text-white', labelStyle)}>{label}</p>
        {required && <div className="text-red-500">*</div>}
      </Label>
    ) : null}
    <div
      className={cn(
        additionalLabel ? 'grid grid-cols-12' : 'flex',
        'border-5 relative items-center',
      )}
    >
      <Input
        id={id}
        className={cn(
          additionalLabel ? 'col-span-10' : 'col-span-12',
          inputStyle ??
            'box-border min-h-[40px] rounded-[4px] border-rs-v2-galaxy-blue bg-rs-v2-galaxy-blue px-4 py-4 text-white placeholder:text-rs-neutral-dark-platinum focus-visible:bg-rs-v2-galaxy-blue focus-visible:ring-0 focus-visible:ring-offset-0 hover:enabled:border-rs-v2-mint focus:enabled:border-rs-v2-mint  active:enabled:border-rs-v2-mint disabled:border-rs-v2-slate-blue disabled:bg-rs-v2-slate-blue disabled:text-rs-v2-gunmetal-blue disabled:opacity-100 placeholder:disabled:text-rs-v2-gunmetal-blue',
          className,
        )}
        name={name}
        role="textbox"
        aria-label={name}
        value={value}
        onBlur={onBlur}
        onChange={onChange}
        {...rest}
      />
      {endContent && (
        <span className="absolute right-4 cursor-pointer">{endContent}</span>
      )}
      {additionalLabel && (
        <div className="col-span-2 flex items-center justify-center">
          {additionalLabel}
        </div>
      )}
    </div>

    {helperText && !errorMessage ? (
      <p className={cn(helperClassname, 'mt-0.5 text-xs font-light')}>
        {helperText}
      </p>
    ) : errorMessage ? (
      <p className="mt-0.5 text-xs text-red-500">{errorMessage}</p>
    ) : null}
  </div>
);

export default InputComponent;
