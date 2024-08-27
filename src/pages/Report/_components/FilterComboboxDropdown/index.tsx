import { GoChevronDown } from 'react-icons/go';
import { FC, useEffect, useRef, useState } from 'react';
import {
  MdDeleteOutline,
  MdOutlineCheck,
  MdOutlineCheckBox,
  MdOutlineCheckBoxOutlineBlank,
} from 'react-icons/md';

import { cn } from '@/lib/utils';

import { Drawer, DrawerContent } from '@/components/ui/drawer';

type Props = {
  additionalDrawerTitle?: string;
  options: {
    label: string;
    value: string;
  }[];
  useCombobox?: boolean;
  selectedOption?: string[];
  title?: string;
  onChange?: (value?: string[]) => void;
  clearAction?: () => void;
  className?: string;
  drawerClassName?: string;
  placeholder?: string;
  fullWidth?: boolean;
  useDrawerOnSmallScreen?: boolean;
  withSelectAll?: boolean;
  singleSelect?: boolean;
};

const FilterComboboxDropdown: FC<Props> = ({
  additionalDrawerTitle,
  options,
  selectedOption,
  title,
  clearAction,
  onChange,
  className,
  drawerClassName,
  placeholder,
  fullWidth,
  useDrawerOnSmallScreen,
  withSelectAll,
  singleSelect = false,
}) => {
  const [open, setOpen] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleChange = (item: string) => {
    if (singleSelect) {
      onChange?.([item]);
      return;
    }

    let newValue;

    const alreadyExist = selectedOption?.includes(item);

    if (alreadyExist) {
      newValue = selectedOption?.filter((value) => value !== item);
    } else {
      newValue = [...(selectedOption || []), item];
    }

    onChange?.(newValue);
  };

  useEffect(() => {
    const handleClose = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setSearchValue('');
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClose);

    return () => {
      document.removeEventListener('mousedown', handleClose);
    };
  }, []);

  const filteredOptions =
    searchValue?.length > 0
      ? options?.filter((option) =>
          option.label.toLowerCase().includes(searchValue.toLowerCase()),
        )
      : options;

  const handleSelectAll = () => {
    if (selectedOption?.length === options.length) {
      onChange?.([]);
    } else {
      onChange?.(options.map((option) => option.value));
    }
  };

  console.log(singleSelect);

  return (
    <div className={cn('relative', fullWidth && 'w-full')} ref={dropdownRef}>
      <button
        onClick={() => {
          setOpen(!open);
          setOpenDrawer(!openDrawer);
        }}
        className={cn(
          'flex h-[30px] min-w-[150px] max-w-[185px] items-center justify-between gap-2 rounded-md border border-rs-v2-mint bg-rs-v2-mint-20% px-3 text-sm text-rs-v2-mint',
          className,
        )}
        type="button"
      >
        <input
          placeholder={title ? '' : placeholder}
          className="absolute inset-0 h-full w-full bg-transparent pe-8 ps-3 text-sm  placeholder-rs-neutral-dark-platinum outline-none"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <p className={cn('truncate', searchValue !== '' && 'text-transparent')}>
          {title}
        </p>
        <GoChevronDown className="flex-shrink-0" />
      </button>
      {useDrawerOnSmallScreen ? (
        <Drawer open={openDrawer} onOpenChange={setOpenDrawer}>
          <DrawerContent className="bg-rs-v2-thunder-blue [&_.custom-line]:bg-rs-neutral-dark-platinum">
            <div className="flex flex-col">
              {withSelectAll && options?.length > 0 && !singleSelect && (
                <button
                  className="group flex items-center gap-2 px-4 py-3 text-left"
                  type="button"
                  onClick={() => {
                    handleSelectAll();
                  }}
                >
                  {selectedOption?.length === options?.length ? (
                    <MdOutlineCheckBox
                      className="mb-[2px] flex-shrink-0 text-rs-v2-mint"
                      size={16}
                    />
                  ) : (
                    <MdOutlineCheckBoxOutlineBlank
                      className="mb-[2px] flex-shrink-0"
                      size={16}
                    />
                  )}
                  <p className="truncate group-hover:text-rs-v2-mint">
                    Select All
                  </p>
                </button>
              )}
              {filteredOptions?.map((option) => {
                const isSelected = selectedOption?.includes(option.value);
                return (
                  <button
                    className={cn(
                      'group flex items-center gap-2 px-4 py-3 text-left',
                      singleSelect && 'justify-between',
                    )}
                    key={option.value}
                    type="button"
                    onClick={() => {
                      handleChange(option.value);
                    }}
                  >
                    {!singleSelect ? (
                      isSelected ? (
                        <MdOutlineCheckBox
                          className="mb-[2px] flex-shrink-0 text-rs-v2-mint"
                          size={16}
                        />
                      ) : (
                        <MdOutlineCheckBoxOutlineBlank
                          className="mb-[2px] flex-shrink-0"
                          size={16}
                        />
                      )
                    ) : null}
                    <p className="truncate group-hover:text-rs-v2-mint">
                      {option.label}
                    </p>
                    {singleSelect && isSelected && (
                      <MdOutlineCheck
                        className="mb-[2px] flex-shrink-0 text-rs-v2-mint"
                        size={16}
                      />
                    )}
                  </button>
                );
              })}
              {clearAction && (
                <button
                  onClick={() => clearAction()}
                  type="button"
                  className="group flex items-center gap-2 border-t border-rs-neutral-dark-platinum px-4 py-3 text-left text-rs-v2-red"
                >
                  <MdDeleteOutline
                    size={16}
                    className="mb-[2px] flex-shrink-0"
                  />
                  <p className="truncate">Delete Filter</p>
                </button>
              )}
            </div>
          </DrawerContent>
        </Drawer>
      ) : (
        open && (
          <div
            className={cn(
              'absolute top-[34px] z-[999] flex max-h-[300px] w-full flex-col overflow-y-auto rounded-md bg-rs-v2-thunder-blue shadow-[0px_4px_25.9px_-12px_rgba(32,32,32,0.25)]',
              drawerClassName,
            )}
          >
            {additionalDrawerTitle && (
              <p className="px-3 pb-1 pt-3 text-sm">{additionalDrawerTitle}</p>
            )}
            <div className="flex flex-col">
              {withSelectAll && options?.length > 0 && !singleSelect && (
                <button
                  className="group flex items-center gap-2 px-4 py-3 text-left"
                  type="button"
                  onClick={() => {
                    handleSelectAll();
                  }}
                >
                  {selectedOption?.length === options?.length ? (
                    <MdOutlineCheckBox
                      className="mb-[2px] flex-shrink-0 text-rs-v2-mint"
                      size={16}
                    />
                  ) : (
                    <MdOutlineCheckBoxOutlineBlank
                      className="mb-[2px] flex-shrink-0"
                      size={16}
                    />
                  )}
                  <p className="truncate group-hover:text-rs-v2-mint">
                    Select All
                  </p>
                </button>
              )}
              {filteredOptions?.map((option) => {
                const isSelected = selectedOption?.includes(option.value);
                return (
                  <button
                    className={cn(
                      'group flex items-center gap-2 px-4 py-3 text-left',
                      singleSelect && 'justify-between',
                    )}
                    key={option.value}
                    type="button"
                    onClick={() => {
                      handleChange(option.value);
                    }}
                  >
                    {!singleSelect ? (
                      isSelected ? (
                        <MdOutlineCheckBox
                          className="mb-[2px] flex-shrink-0 text-rs-v2-mint"
                          size={16}
                        />
                      ) : (
                        <MdOutlineCheckBoxOutlineBlank
                          className="mb-[2px] flex-shrink-0"
                          size={16}
                        />
                      )
                    ) : null}
                    <p className="truncate group-hover:text-rs-v2-mint">
                      {option.label}
                    </p>
                    {singleSelect && isSelected && (
                      <MdOutlineCheck
                        className="mb-[2px] flex-shrink-0 text-rs-v2-mint"
                        size={16}
                      />
                    )}
                  </button>
                );
              })}
              {clearAction && (
                <button
                  onClick={() => clearAction()}
                  type="button"
                  className="group flex items-center gap-2 border-t border-rs-neutral-dark-platinum px-4 py-3 text-left text-rs-v2-red"
                >
                  <MdDeleteOutline
                    size={16}
                    className="mb-[2px] flex-shrink-0"
                  />
                  <p className="truncate">Delete Filter</p>
                </button>
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default FilterComboboxDropdown;
