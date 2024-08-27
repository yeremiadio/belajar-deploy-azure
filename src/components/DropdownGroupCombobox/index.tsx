import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { cn } from '@/lib/utils';

import { BasicSelectOpt } from '@/types/global';
import { GoChevronDown } from 'react-icons/go';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandDropdownGroupInput,
} from '@/components/ui/command';
import { MdCheck } from 'react-icons/md';
import { Separator } from '@radix-ui/react-dropdown-menu';

export type DropdownGroupComboboxProps = {
  options: BasicSelectOpt<string | number>[];
  handleNewGroup?: (args?: any) => void;
  handleManageGroup?: (args?: any) => void;
  placeholder?: string;
};

const DropdownGroupCombobox = ({
  options,
  handleManageGroup,
  handleNewGroup,
  placeholder,
}: DropdownGroupComboboxProps) => {
  const [selectedItem, setselectedItem] = useState<BasicSelectOpt<
    number | string
  > | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const handleSelectItem = (item: BasicSelectOpt<string | number>) =>
    setselectedItem(item);
  const handleCloseDropdown = () => setOpen(false);
  return (
    <Popover open={open} onOpenChange={(value) => setOpen(value)}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn(
            'w-[160px] justify-between border border-solid border-rs-v2-thunder-blue bg-transparent hover:bg-rs-v2-galaxy-blue',
            selectedItem && !selectedItem.value && 'text-muted-foreground',
          )}
        >
          {placeholder ? placeholder : 'Select...'}
          <GoChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[160px] border-none p-0">
        <Command className="border-none bg-rs-v2-thunder-blue">
          <CommandDropdownGroupInput
            placeholder="Search Group..."
            className="h-9"
          />
          <CommandEmpty>No item is found.</CommandEmpty>
          <CommandGroup className="p-0">
            {options.map((option) => (
              <CommandItem
                className="m-1 cursor-pointer p-3"
                value={option.label?.toString()}
                key={option.value}
                onSelect={() => {
                  handleSelectItem(option);
                }}
              >
                <MdCheck
                  className={cn(
                    'mr-4 h-4 w-4 text-rs-v2-mint',
                    selectedItem && option.value === selectedItem.value
                      ? 'opacity-100'
                      : 'opacity-0',
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
            <Separator className="h-[1px] bg-rs-v2-gunmetal-blue" />
            <CommandItem
              className="m-1 cursor-pointer p-3"
              onSelect={() => {
                handleNewGroup && handleNewGroup();
                handleCloseDropdown();
              }}
            >
              <p className="ml-8">New Group</p>
            </CommandItem>
            <Separator className="h-[1px] bg-rs-v2-gunmetal-blue" />
            <CommandItem
              className="m-1 cursor-pointer p-3"
              onSelect={() => {
                handleManageGroup && handleManageGroup();
                handleCloseDropdown();
              }}
            >
              <p className="ml-8">Manage Group</p>
            </CommandItem>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default DropdownGroupCombobox;
