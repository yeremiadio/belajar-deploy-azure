import {
  FC,
  ComponentType,
  useState,
  SetStateAction,
  Dispatch,
  FocusEventHandler,
  ReactNode,
  isValidElement,
  Fragment,
} from 'react';

import { RxCheck, RxCaretDown } from 'react-icons/rx';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  // CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Label } from '@/components/ui/label';

interface Props {
  label?: string;
  options: {
    label: string | number | ReactNode;
    value: string | number | object;
    icon?: ComponentType<{ className?: string }>;
  }[];
  selectedValues: string | number | object | undefined;
  setSelectedValues: Dispatch<
    SetStateAction<string | number | object | undefined>
  >;
  size: 'lg' | 'sm' | 'default';
  placeholder: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  isError?: boolean;
  helperText?: string;
  onBlur?: FocusEventHandler<HTMLDivElement>;
}

const SingleSelect: FC<Props> = ({
  label,
  options,
  selectedValues,
  setSelectedValues,
  size,
  placeholder,
  className,
  required,
  isError,
  helperText,
  disabled,
  onBlur,
  ...rest
}) => {
  const [open, setOpen] = useState(false);
  const handleSelect = (selectedValue: string | number | object) => {
    setSelectedValues(selectedValue);
    setOpen(false);
  };

  return (
    <div className={cn('grid items-center gap-2', className)} onBlur={onBlur}>
      {label && (
        <Label htmlFor={label} className="flex">
          <p className="text-sm text-white">{label}</p>
          {required && <div className="text-red-500">*</div>}
        </Label>
      )}
      <Popover open={open} onOpenChange={setOpen} {...rest}>
        <PopoverTrigger asChild>
          <Button
            id={label}
            role="combobox"
            size={size}
            disabled={disabled}
            aria-label={placeholder}
            aria-expanded={open}
            className={cn(
              'flex min-h-[36px] w-full justify-between rounded border border-rs-v2-galaxy-blue bg-rs-v2-galaxy-blue px-3 py-3 text-sm text-white hover:bg-rs-v2-galaxy-blue active:bg-rs-v2-galaxy-blue',
              isError
                ? 'border-rs-v2-red hover:border-rs-v2-red focus:border-rs-v2-red active:border-rs-v2-red'
                : 'hover:border-rs-v2-mint focus:border-rs-v2-mint active:border-rs-v2-mint',
            )}
          >
            {selectedValues ? (
              options
                .filter(
                  (option) =>
                    JSON.stringify(selectedValues) ===
                    JSON.stringify(option.value),
                )
                .map((option, index) => (
                  <Fragment key={index}>{option.label}</Fragment>
                ))
            ) : (
              <span className="text-rs-neutral-steel-gray">{placeholder}</span>
            )}
            <RxCaretDown
              className={cn(
                'ml-2 h-4 w-4 shrink-0 text-rs-neutral-steel-gray',
                open && 'rotate-180 text-rs-v2-mint',
              )}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="border-rs-v2-navy-blue-60% bg-rs-deep-navy p-0"
          align="start"
        >
          <Command className="border-rs-v2-navy-blue-60% bg-rs-deep-navy">
            <CommandInput
              className="text-base"
              placeholder="Search options..."
            />
            <CommandEmpty className="p-4 text-base">
              No results found.
            </CommandEmpty>
            <CommandGroup
              heading="Options"
              className="max-h-[200px] overflow-auto overscroll-auto"
            >
              {/* {options.map((opts, index) => (
                <CommandItem
                  onSelect={() => {
                    handleSelect(opts.value);
                  }}
                  className="text-base"
                  key={index}
                >
                  <RxCheck
                    className={cn(
                      'mr-2 h-4 w-4',
                      selectedValues === opts.value
                        ? 'text-rs-v2-mint opacity-100'
                        : 'opacity-0',
                    )}
                  />
                  {opts.label?.toString()}
                </CommandItem>
              ))} */}
              {options.map((opts, index) => (
                <div
                  onClick={() => {
                    handleSelect(opts.value);
                  }}
                  className="relative flex cursor-default select-none items-center rounded-sm p-2 text-sm outline-none hover:bg-rs-v2-navy-blue aria-selected:bg-accent aria-selected:text-blue-500 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                  key={index}
                >
                  <RxCheck
                    className={cn(
                      'mr-2 h-4 w-4',
                      JSON.stringify(selectedValues) ===
                        JSON.stringify(opts.value)
                        ? 'text-rs-v2-mint opacity-100'
                        : 'opacity-0',
                    )}
                  />
                  {isValidElement(opts.label)
                    ? opts.label
                    : opts.label?.toString()}
                </div>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      <p className={cn('text-xs', isError && 'text-red-500')}>{helperText}</p>
    </div>
  );
};

export default SingleSelect;
