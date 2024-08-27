import { FC, useState } from 'react';
import { RxCaretDown } from 'react-icons/rx';
import { IconType } from 'react-icons';
import { cn } from '@/lib/utils';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export interface IMenuDropdownItem {
  label: string;
  disabled?: boolean;
  onClick: () => void;
}

interface Props {
  menuItems: IMenuDropdownItem[];
  placeholder: string;
  buttonClassName?: string;
  Icon?: IconType;
}

const DropdownComponent: FC<Props> = ({
  menuItems,
  placeholder,
  buttonClassName,
  Icon,
}) => {
  const [open, setOpen] = useState(false);
  const toggleDropdown = () => {
    setOpen(!open);
  };

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger
          asChild
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Button
            size="lg"
            className={cn(
              'flex w-full justify-between border px-[12px] text-sm text-white',
              'border-rs-v2-thunder-blue bg-rs-v2-navy-blue hover:bg-rs-v2-navy-blue focus:bg-rs-v2-navy-blue active:bg-rs-v2-navy-blue',
              buttonClassName,
            )}
            onClick={toggleDropdown}
          >
            {placeholder}
            {Icon ? (
              <Icon />
            ) : (
              <RxCaretDown
                className={cn(
                  'ml-2 shrink-0 text-rs-neutral-steel-gray',
                  open && 'rotate-180',
                )}
                size={18}
              />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="bg-rs-v2-navy-blue-60% border-transparent w-full"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {menuItems.map((item, index) => (
            <DropdownMenuItem
              className={cn(
                'bg-rs-v2-navy-blue-60% text-base hover:bg-transparent hover:text-rs-v2-mint focus:bg-transparent focus:text-rs-v2-mint',
              )}
              disabled={item.disabled}
              key={index}
              onClick={item.onClick}
            >
              {item.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default DropdownComponent;
