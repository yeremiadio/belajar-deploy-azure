import { FC } from 'react';
import { MdAdd, MdClose, MdSearch } from 'react-icons/md';

import InputComponent from '@/components/InputComponent';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Props = {
  searchKeyword: string;
  setSearchKeyword: (value: string) => void;
  handleCreateOrder: () => void;
};

const ToolbarAction: FC<Props> = ({
  searchKeyword,
  setSearchKeyword,
  handleCreateOrder,
}) => {
  return (
    <div className="flex flex-col gap-5 px-1 md:flex-row md:justify-between md:gap-10">
      <div className="flex flex-1 flex-wrap items-center gap-4 p-0">
        <InputComponent
          containerStyle="w-fit"
          addonRight={
            searchKeyword && searchKeyword.length > 0 ? (
              <MdClose
                size={24}
                className="cursor-pointer"
                onClick={() => setSearchKeyword('')}
              />
            ) : (
              <MdSearch
                size={24}
                className={cn(
                  searchKeyword && searchKeyword.length > 0 && 'hidden',
                )}
              />
            )
          }
          inputStyle="min-h-[40px] rounded-[4px] border-rs-v2-slate-blue bg-rs-v2-slate-blue pr-4 py-4 text-white placeholder:text-rs-neutral-dark-platinum focus-visible:bg-rs-v2-slate-blue focus-visible:ring-0 focus-visible:ring-offset-0 hover:enabled:border-rs-v2-mint focus:enabled:border-rs-v2-mint  active:enabled:border-rs-v2-mint disabled:border-rs-v2-slate-blue disabled:bg-rs-v2-slate-blue disabled:text-rs-v2-gunmetal-blue disabled:opacity-100 placeholder:disabled:text-rs-v2-gunmetal-blue"
          type="search"
          value={searchKeyword}
          placeholder="Search..."
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
      </div>

      <Button
        onClick={handleCreateOrder}
        className="btn-primary-mint hover:hover-btn-primary-mint flex h-[40px] w-fit items-center gap-2 px-8"
      >
        Create New Order <MdAdd size={18} />
      </Button>
    </div>
  );
};

export default ToolbarAction;
