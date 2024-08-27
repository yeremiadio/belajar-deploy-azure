import { FC } from 'react';
import { RxCheck } from 'react-icons/rx';
import { GoChevronDown } from 'react-icons/go';
import Select, { Option, SelectProps } from 'rc-select';

import { Label } from '@/components/ui/label';

import { cn } from '@/lib/utils';

interface SelectComponentProps extends SelectProps {
  label?: string;
  required?: boolean;
  errorMessage?: string;
  helperText?: string;
  helperClassname?: string;
  isError?: boolean;
  containerClassName?: string;
  labelClassName?: string;
  additionalBelowText?: string;
  popupContainer?: 'body' | 'parent';
}

const SelectComponent: FC<SelectComponentProps> = ({
  options,
  onChange,
  value,
  loading,
  mode,
  label,
  required,
  errorMessage,
  placeholder,
  helperText,
  helperClassname,
  isError,
  containerClassName,
  labelClassName,
  additionalBelowText,
  id,
  popupContainer = 'parent',
  ...rest
}) => {
  const menuItemSelectedIcon = ({ isSelected }: { isSelected: boolean }) => (
    <div
      className={cn(
        'mr-2',
        mode
          ? 'flex h-4 w-4 items-center justify-center rounded-sm border border-rs-neutral-steel-gray'
          : '',
        isSelected
          ? 'border-rs-v2-mint bg-transparent text-rs-v2-mint'
          : 'opacity-50 [&_svg]:invisible',
      )}
    >
      <RxCheck className={cn('h-4 w-4')} />
    </div>
  );

  return (
    <div className={cn('grid w-full items-center gap-2', containerClassName)}>
      {label && (
        <Label htmlFor={label} className={cn('flex', labelClassName)}>
          <p className="text-sm text-white">{label}</p>
          {required && <div className="text-red-500">*</div>}
        </Label>
      )}
      <Select
        id={id}
        value={value}
        style={{ width: '100%' }}
        mode={mode}
        showSearch
        loading={loading}
        suffixIcon={<GoChevronDown className={cn('h-5 w-5')} />}
        optionFilterProp="children"
        optionLabelProp="children"
        placeholder={placeholder}
        onChange={onChange}
        dropdownStyle={{ position: 'fixed' }}
        getPopupContainer={
          popupContainer === 'body'
            ? () => document.body
            : (trigger) => trigger.parentElement
        }
        dropdownClassName="!bg-rs-v2-thunder-blue !z-[100] !border-rs-v2-thunder-blue !rounded !shadow-[0_0_24px_0_#00000033] min-h-max"
        notFoundContent="No data found"
        removeIcon={''}
        tokenSeparators={[' ', ',']}
        menuItemSelectedIcon={menuItemSelectedIcon}
        {...rest}
      >
        {options?.map((option, index) => (
          <Option key={index} value={option.value}>
            {option.label}
          </Option>
        ))}
      </Select>

      {helperText && !isError ? (
        <p className={cn(helperClassname, 'mt-0.5 text-xs font-light')}>
          {helperText}
        </p>
      ) : null}

      {errorMessage && (
        <p className="mt-0.5 text-xs text-red-500">{errorMessage}</p>
      )}
    </div>
  );
};

export default SelectComponent;
