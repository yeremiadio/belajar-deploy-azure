import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { GoChevronDown } from 'react-icons/go';
import { MdCheck } from 'react-icons/md';
import { Separator } from '@radix-ui/react-dropdown-menu';

import { DropdownGroupComboboxProps } from '@/components/DropdownGroupCombobox';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandDropdownGroupInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { cn } from '@/lib/utils';

import { Row } from '@tanstack/react-table';
import { ErrorMessageBackendDataShape } from '@/types/api';
import {
  IAssignInventoryGroupObj,
  IInventory,
} from '@/types/api/management/inventory';
import {
  useAssignGroupsMutation,
  useDeleteInventoryGroupsMutation,
} from '@/stores/managementStore/inventoryStore';

type DropdownInventoryGroup = DropdownGroupComboboxProps & {
  selectedRows: Row<IInventory>[];
  setSelectedRows: Dispatch<SetStateAction<Row<IInventory>[]>>;
};

const DropdownInventoryGroup = ({
  options,
  handleManageGroup,
  handleNewGroup,
  placeholder,
  selectedRows,
  setSelectedRows,
}: DropdownInventoryGroup) => {
  const [search, setSearch] = useState<string>('');
  const inventoryIdsMemo = useMemo<number[]>(() => {
    const ids = selectedRows.map((row) => row.original.id);
    return ids;
  }, [selectedRows]);
  const existingGroupIdsMemo = useMemo<number[]>(() => {
    const ids = selectedRows.map((row) =>
      row.original.group.map((item) => item.id),
    );
    const combinedArray = ids.reduce((acc, curr) => acc.concat(curr), []);
    // Filter out duplicates
    const mergedArray = combinedArray.filter((value, index, self) => {
      return self.indexOf(value) === index;
    });

    return mergedArray;
  }, [selectedRows]);

  const [updateInventoryGroupList] = useAssignGroupsMutation();
  const [deleteInventoryGroupList] = useDeleteInventoryGroupsMutation();

  const handleAddInventoryGroup = useCallback(
    async (groupId: number) => {
      if (!inventoryIdsMemo || inventoryIdsMemo.length === 0) return;
      let existGroupIds = [];
      existGroupIds.push(groupId);
      const data: IAssignInventoryGroupObj = {
        inventoryIds: inventoryIdsMemo,
        groupIds: existGroupIds,
      };
      await updateInventoryGroupList(data)
        .unwrap()
        .then(() => {
          setOpen(false);
          setSelectedRows([]);
        })
        .catch((error: ErrorMessageBackendDataShape) => console.log(error));
    },
    [inventoryIdsMemo, updateInventoryGroupList, existingGroupIdsMemo],
  );
  const handleRemoveInventoryGroup = useCallback(
    async (groupId: number) => {
      if (!inventoryIdsMemo || inventoryIdsMemo.length === 0) return;
      const existGroupIds: number[] = [];
      existGroupIds.push(groupId);
      const data: IAssignInventoryGroupObj = {
        inventoryIds: inventoryIdsMemo,
        groupIds: Array.from(new Set(existGroupIds)),
      };
      await deleteInventoryGroupList(data)
        .unwrap()
        .then(() => {
          setOpen(false);
          setSelectedRows([]);
        })
        .catch((error: ErrorMessageBackendDataShape) => console.log(error));
    },
    [inventoryIdsMemo, updateInventoryGroupList, existingGroupIdsMemo],
  );
  const checkIsInventoryGroupSelected = useCallback(
    (groupId: number): boolean => {
      if (!selectedRows || selectedRows.length === 0) return false;
      const isSelected = selectedRows.every((row) =>
        row.original.group.some((group) => group.id === groupId),
      );
      return isSelected;
    },
    [selectedRows],
  );

  const [open, setOpen] = useState<boolean>(false);
  const handleCloseDropdown = () => setOpen(false);
  const handleSearchGroup = (value: string) => {
    const option = value.toString();
    if (!!option) {
      return option.toLocaleLowerCase().includes(search.toLowerCase());
    } else {
      return false;
    }
  };
  return (
    <Popover open={open} onOpenChange={(value) => setOpen(value)}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn(
            'w-[160px] justify-between border border-solid border-rs-v2-thunder-blue bg-transparent hover:bg-rs-v2-galaxy-blue',
          )}
        >
          {placeholder ? placeholder : 'Select...'}
          <GoChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[160px] border-none p-0">
        <Command className="border-none bg-rs-v2-thunder-blue" shouldFilter={false}>
          <CommandDropdownGroupInput
            placeholder="Search Group..."
            className="h-9"
            value={search}
            onValueChange={(value) => setSearch(value)}
          />
          <CommandEmpty>No item is found.</CommandEmpty>
          <CommandGroup className="p-0">
            <div className="max-h-[180px] overflow-y-auto">
              {options
                .filter((item) =>
                  handleSearchGroup(item.label?.toString() ?? ''),
                )
                .map((option) => {
                  const isSelected = checkIsInventoryGroupSelected(
                    Number(option.value),
                  );
                  return (
                    <CommandItem
                      className="m-1 cursor-pointer p-3"
                      value={option.label?.toString()}
                      key={option.value}
                      onSelect={() => {
                        if (!isSelected) {
                          if (!!option.value) {
                            handleAddInventoryGroup(Number(option.value));
                          }
                        } else {
                          handleRemoveInventoryGroup(Number(option.value));
                        }
                        //   handleSelectItem(option);
                      }}
                    >
                      <MdCheck
                        className={cn(
                          'mr-4 h-4 w-4 text-rs-v2-mint',
                          isSelected ? 'opacity-100' : 'opacity-0',
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  );
                })}
            </div>
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

export default DropdownInventoryGroup;
