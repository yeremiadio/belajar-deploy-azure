import { FC } from 'react';
import { IconType } from 'react-icons';
import {
  MdAdd,
  MdFilter1,
  MdFilter9Plus,
  MdFilter2,
  MdFilter3,
  MdFilter4,
  MdFilter5,
  MdFilter6,
  MdFilter7,
  MdFilter8,
  MdFilter9,
} from 'react-icons/md';

import { cn } from '@/lib/utils';

type Props = {
  filterCount?: number;
  onClick?: () => void;
  disabled?: boolean;
};

const AddFilterButton: FC<Props> = ({ filterCount, onClick, disabled }) => {
  let Icon: IconType;

  switch (filterCount) {
    case 0:
      Icon = MdAdd;
      break;
    case 1:
      Icon = MdFilter1;
      break;
    case 2:
      Icon = MdFilter2;
      break;
    case 3:
      Icon = MdFilter3;
      break;
    case 4:
      Icon = MdFilter4;
      break;
    case 5:
      Icon = MdFilter5;
      break;
    case 6:
      Icon = MdFilter6;
      break;
    case 7:
      Icon = MdFilter7;
      break;
    case 8:
      Icon = MdFilter8;
      break;
    case 9:
      Icon = MdFilter9;
      break;
    default:
      Icon = MdFilter9Plus;
      break;
  }

  const filterApplied = !!filterCount && filterCount > 0;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'relative flex h-[30px] min-w-[103px] items-center justify-between gap-3 rounded-md bg-rs-v2-slate-blue-60% px-3 text-sm hover:bg-rs-v2-navy-blue-60%',
        disabled && 'opacity-70 hover:bg-rs-v2-slate-blue-60%',
      )}
    >
      {filterApplied ? 'Filter' : 'Add Filter'}
      <Icon size={18} />
      {filterApplied && (
        <span className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full bg-rs-alert-yellow" />
      )}
    </button>
  );
};

export default AddFilterButton;
