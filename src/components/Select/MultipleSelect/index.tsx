import {
  FC,
  ComponentType,
  SetStateAction,
  Dispatch,
  useState,
  isValidElement,
  ReactNode,
} from 'react';
import { RxCheck, RxCaretDown } from 'react-icons/rx';
import { PopperContentProps } from '@radix-ui/react-popover';

import { cn } from '@/lib/utils';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Label } from '@/components/ui/label';

interface Props extends PopperContentProps {
  options: {
    label: string | number | ReactNode;
    value: string | number;
    icon?:
      | ComponentType<{
          className?: string;
        }>
      | undefined;
  }[];
  selectedValues: (string | undefined)[] | (number | undefined)[] | undefined;
  setSelectedValues: Dispatch<SetStateAction<(string | number | undefined)[]>>;
  size: 'lg' | 'sm' | 'default';
  placeholder: string;
  disabled?: boolean;
  className?: string;
  label: string;
  isError?: boolean;
  helperText?: string;
  required?: boolean;
}

const MultipleSelect: FC<Props> = ({
  options,
  selectedValues,
  setSelectedValues,
  size,
  placeholder,
  disabled = false,
  className,
  label,
  helperText,
  isError,
  required,
  ...rest
}) => {
  const [open, setOpen] = useState(false);
  const [stateSelect, setStateSelect] = useState<
    (string | number | undefined)[]
  >(selectedValues ?? []);

  const toggleValue = (
    prevSelectedValues: (string | number | undefined)[] | undefined,
    value: string | number | undefined,
  ) => {
    const updatedValues = [...(prevSelectedValues ?? [])];

    if (value !== undefined) {
      const index = updatedValues?.indexOf(value) || 0;

      if (index === -1) {
        updatedValues?.push(value);
      } else {
        updatedValues?.splice(index, 1);
      }
    }
    setSelectedValues(updatedValues);
    return updatedValues;
  };

  const handleSelect = (value: string | number | undefined) => {
    setStateSelect((prevSelectedValues) =>
      toggleValue(prevSelectedValues || [], value),
    );
  };
  return (
    <div>
      <div className="mb-2">
        <Label htmlFor={label} className="flex">
          <p className="text-sm text-white">{label}</p>
          {required && <div className="text-red-500">*</div>}
        </Label>
      </div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            size={size}
            disabled={disabled}
            className={cn(
              'flex h-auto justify-between rounded border border-rs-v2-galaxy-blue bg-rs-v2-galaxy-blue px-3 py-3 text-sm text-white hover:bg-rs-v2-galaxy-blue focus:bg-rs-v2-galaxy-blue active:bg-rs-v2-galaxy-blue',
              isError
                ? 'border-rs-v2-red hover:border-rs-v2-red focus:border-rs-v2-red active:border-rs-v2-red'
                : 'hover:border-rs-v2-mint focus:border-rs-v2-mint active:border-rs-v2-mint',
              className,
            )}
          >
            {stateSelect && stateSelect?.length > 0 ? (
              <div className="flex w-fit flex-wrap space-x-1 space-y-1">
                {stateSelect.length > 5 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-full bg-rs-alert-green-30% px-3 py-1 text-sm font-normal text-rs-alert-green"
                  >
                    {stateSelect.length} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) =>
                      stateSelect.includes(option.value as never),
                    )
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.value}
                        className="rounded-full bg-rs-alert-green-30% px-3 py-1 text-sm font-normal text-rs-alert-green"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            ) : (
              <>{placeholder}</>
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
          className="border-rs-v2-navy-blue-60% bg-rs-v2-navy-blue-60% p-0"
          {...rest}
        >
          <Command className="w-full border-rs-v2-navy-blue-60% bg-rs-v2-navy-blue-60%">
            <CommandInput
              className="text-base"
              placeholder="Search Options..."
            />
            <CommandList>
              <CommandEmpty className="p-4 text-base">
                No results found.
              </CommandEmpty>
              <CommandGroup heading="Options">
                {options.map((option) => {
                  const isSelected =
                    stateSelect && stateSelect.includes(option.value);
                  return (
                    <CommandItem
                      key={option.value}
                      className="text-base"
                      onSelect={() => {
                        handleSelect(option.value);
                      }}
                    >
                      <div
                        className={cn(
                          'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-rs-neutral-steel-gray',
                          isSelected
                            ? 'border-rs-v2-mint bg-transparent text-rs-v2-mint'
                            : 'opacity-50 [&_svg]:invisible',
                        )}
                      >
                        <RxCheck className={cn('h-4 w-4')} />
                      </div>
                      {option.icon && (
                        <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                      )}
                      {isValidElement(option.label) ? (
                        option.label
                      ) : (
                        <span>{option.label}</span>
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
              {stateSelect && stateSelect.length > 0 && (
                <>
                  <CommandSeparator />
                  <CommandGroup>
                    <CommandItem
                      onSelect={() => setStateSelect([])}
                      className="justify-center text-center text-base"
                    >
                      Clear Selects
                    </CommandItem>
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {helperText ? (
        <div className="mt-1">
          <p className={cn('text-sm font-light', isError && 'text-rs-v2-red')}>
            {helperText}
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default MultipleSelect;
