import { FC, SetStateAction, Dispatch, useState } from 'react';
import { MdClose, MdSearch } from 'react-icons/md';
import { MdOutlineDownload } from 'react-icons/md';

import { useToast } from '@/components/ui/use-toast';

import generateDynamicToastMessage from '@/utils/functions/generateDynamicToastMessage';

import { exportAPI } from '@/api/exportApi';

import { Button } from '@/components/ui/button';
import InputComponent from '@/components/InputComponent';
import { cn } from '@/lib/utils';

interface Props {
  onExportButton?: boolean;
  exportName?: string;
  exportText?: string;
  onSearchInput?: boolean;
  additionalPrefixToolbarElement?: JSX.Element;
  additionalSuffixToolbarElement?: JSX.Element;
  onSearchInputChange?: Dispatch<SetStateAction<string>>;
  searchInputValue?: string;
  inlineSearchWithPrefix?: boolean;
  exportParams?: URLSearchParams;
}

const TableToolbar: FC<Props> = ({
  exportText = 'Export to CSV',
  exportName,
  onExportButton,
  onSearchInput,
  additionalSuffixToolbarElement,
  additionalPrefixToolbarElement,
  onSearchInputChange,
  searchInputValue,
  inlineSearchWithPrefix,
  exportParams,
}) => {
  const { toast } = useToast();
  const handleSearchInputChange = (value: string) => {
    onSearchInputChange && onSearchInputChange(value);
  };

  const [exporting, setExporting] = useState(false);

  const handleExportCSV = async (
    exportName: string | null | undefined,
    query?: URLSearchParams,
  ) => {
    if (exportName) {
      setExporting(true);
      const success = await exportAPI(exportName, query);
      setExporting(false);

      if (success) {
        toast(
          generateDynamicToastMessage({
            title: 'Success',
            description: `CSV ${exportName}.csv is exported successfully`,
            variant: 'success',
          }),
        );
      } else {
        toast(
          generateDynamicToastMessage({
            title: 'Failed',
            description: `Failed exporting CSV ${exportName}.csv`,
            variant: 'error',
          }),
        );
      }
    }
  };

  return (
    <div className="mb-4 flex flex-row flex-wrap justify-start  gap-2 px-1 md:justify-between">
      <div
        className={cn(
          'flex flex-1 flex-wrap items-center gap-4 p-0',
          inlineSearchWithPrefix && 'flex items-center gap-4',
        )}
      >
        {onSearchInput && (
          <InputComponent
            containerStyle={inlineSearchWithPrefix ? 'w-fit flex order-2' : ''}
            addonRight={
              searchInputValue && searchInputValue.length > 0 ? (
                <MdClose
                  size={24}
                  className="cursor-pointer"
                  onClick={() => handleSearchInputChange('')}
                />
              ) : (
                <MdSearch
                  size={24}
                  className={cn(
                    searchInputValue && searchInputValue.length > 0 && 'hidden',
                  )}
                />
              )
            }
            className="h-12 border-[1px] border-rs-v2-thunder-blue bg-rs-v2-galaxy-blue p-2"
            type="search"
            value={searchInputValue}
            placeholder="Search..."
            onChange={(e) =>
              handleSearchInputChange(e.target.value.toLowerCase())
            }
          />
        )}
        {additionalPrefixToolbarElement}
      </div>
      <div className="flex flex-1 flex-wrap justify-end gap-2">
        {additionalSuffixToolbarElement}
        {onExportButton && (
          <Button
            className="btn-primary-green hover:hover-btn-primary-green"
            onClick={() => handleExportCSV(exportName, exportParams)}
            disabled={exporting}
          >
            <MdOutlineDownload fontSize={13} size={13} className="mr-2" />
            {exportText}
          </Button>
        )}
      </div>
    </div>
  );
};

export default TableToolbar;
