import { Textarea, TextareaProps } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

import { cn } from '@/lib/utils';

const InputTextareaComponent = ({
  value,
  onBlur,
  onChange,
  required,
  label,
  endContent,
  errorMessage,
  inputStyle,
  labelStyle,
  containerStyle,
  ...rest
}: {
  label?: string;
  endContent?: JSX.Element;
  errorMessage?: string;
  textStyle?: string;
  inputStyle?: string;
  labelStyle?: string;
  containerStyle?: string;
} & TextareaProps) => (
  <div className={cn(containerStyle ?? 'grid w-full items-center gap-2')}>
    {label ? (
      <Label htmlFor={label} className="flex">
        <p className={cn(labelStyle ?? 'text-sm text-white')}>{label}</p>
        {required && <div className="text-red-500">*</div>}
      </Label>
    ) : null}
    <div className="border-5 relative flex items-center">
      <Textarea
        className={cn(
          inputStyle ??
            'min-h-[40px] rounded-[4px] border-rs-v2-galaxy-blue bg-rs-v2-galaxy-blue px-4 py-4 text-white placeholder:text-rs-neutral-dark-platinum focus-visible:bg-rs-v2-galaxy-blue focus-visible:ring-0 focus-visible:ring-offset-0 hover:enabled:border-rs-v2-mint focus:enabled:border-rs-v2-mint  active:enabled:border-rs-v2-mint disabled:border-rs-v2-slate-blue disabled:bg-rs-v2-slate-blue disabled:text-rs-v2-gunmetal-blue disabled:opacity-100 placeholder:disabled:text-rs-v2-gunmetal-blue',
        )}
        value={value}
        onBlur={onBlur}
        onChange={onChange}
        {...rest}
      />
      {endContent && (
        <span className="absolute right-4 cursor-pointer">{endContent}</span>
      )}
    </div>
    {errorMessage && (
      <p className="mt-0.5 text-xs text-red-500">{errorMessage}</p>
    )}
  </div>
);

export default InputTextareaComponent;
