import {
  MdArrowBackIos,
  MdArrowForwardIos,
  MdClose,
  MdSearch,
} from 'react-icons/md';

import { CalendarIcon } from '@/assets/images/CalendarIcon';

import { Button } from '@/components/ui/button';

import { cn } from '@/lib/utils';
import { useSearchParams } from 'react-router-dom';
import InputComponent from '@/components/InputComponent';
import { useEffect, useState } from 'react';
import { useDebounce } from '@/utils/hooks/useDebounce';

const CalendarToolbar = ({ ...props }) => {
  const { label, onNavigate, onView, view } = props;
  const [searchParams, setSearchParams] = useSearchParams();
  const productionPlanningFilterParams = searchParams.get('type');
  const searchFilterParams = searchParams.get('search');
  const [search, setSearch] = useState<string>(searchFilterParams ?? '');
  const debouncedSearch = useDebounce(search, 1000);

  const handleFilterProductionPlanning = (type: string) => {
    searchParams.set('type', type);
    setSearchParams(searchParams);
  };
  const handleSearchProductionPlan = (name: string) => setSearch(name);
  useEffect(() => {
    if (debouncedSearch) {
      searchParams.set('search', search);
      setSearchParams(searchParams);
    } else {
      searchParams.delete('search');
      setSearchParams(searchParams);
    }
  }, [debouncedSearch]);

  return (
    <div className="mb-6 flex items-center justify-between">
      <div className="flex items-center">
        <div className="flex min-h-[40px] items-center gap-6">
          <div className="flex items-center rounded-[4px] border border-rs-v2-thunder-blue">
            <Button
              className={cn(
                productionPlanningFilterParams === 'planning'
                  ? 'bg-rs-v2-dark-grey text-rs-v2-mint'
                  : 'bg-rs-v2-navy-blue text-rs-v2-light-grey',
                'rounded-none hover:bg-rs-v2-dark-grey hover:text-rs-v2-mint',
              )}
              onClick={() => handleFilterProductionPlanning('planning')}
            >
              Planning
            </Button>
            <Button
              className={cn(
                productionPlanningFilterParams === 'actual'
                  ? 'bg-rs-v2-dark-grey text-rs-v2-mint'
                  : 'bg-rs-v2-navy-blue text-rs-v2-light-grey',
                'rounded-none rounded-r-[4px] hover:bg-rs-v2-dark-grey hover:text-rs-v2-mint',
              )}
              onClick={() => handleFilterProductionPlanning('actual')}
            >
              Actual
            </Button>
          </div>
        </div>
        <div className="mr-4 inline-flex items-center">
          <Button
            variant="ghost"
            onClick={() => onNavigate('PREV')}
            className="opacity-75 hover:bg-transparent"
          >
            <MdArrowBackIos className="text-xl" />
          </Button>
          <Button
            variant="ghost"
            onClick={() => onNavigate('NEXT')}
            className="opacity-75 hover:bg-transparent"
          >
            <MdArrowForwardIos className="text-xl" />
          </Button>
          <p>{label}</p>
        </div>
        <Button
          className="btn-secondary-navy-blue hover:hover-btn-secondary-navy-blue p-4"
          onClick={() => onNavigate('today', new Date())}
        >
          <CalendarIcon className="mr-4" />
          Today
        </Button>
      </div>
      <div className="flex min-h-[40px] items-center gap-6">
        <InputComponent
          containerStyle="w-fit"
          addonRight={
            search && search.length > 0 ? (
              <MdClose
                size={24}
                className="cursor-pointer"
                onClick={() => handleSearchProductionPlan('')}
              />
            ) : (
              <MdSearch
                size={24}
                className={cn(search && search.length > 0 && 'hidden')}
              />
            )
          }
          inputStyle="min-h-[40px] rounded-[4px] border-rs-v2-slate-blue bg-rs-v2-slate-blue pr-4 py-4 text-white placeholder:text-rs-neutral-dark-platinum focus-visible:bg-rs-v2-slate-blue focus-visible:ring-0 focus-visible:ring-offset-0 hover:enabled:border-rs-v2-mint focus:enabled:border-rs-v2-mint  active:enabled:border-rs-v2-mint disabled:border-rs-v2-slate-blue disabled:bg-rs-v2-slate-blue disabled:text-rs-v2-gunmetal-blue disabled:opacity-100 placeholder:disabled:text-rs-v2-gunmetal-blue"
          type="search"
          value={search}
          placeholder="Search..."
          onChange={(e) => handleSearchProductionPlan(e.target.value)}
        />
        <div className="flex items-center rounded-[4px] border border-rs-v2-thunder-blue">
          <Button
            className={cn(
              view === 'month'
                ? 'bg-rs-v2-dark-grey text-rs-v2-mint'
                : 'bg-rs-v2-navy-blue text-rs-v2-light-grey',
              'rounded-none hover:bg-rs-v2-dark-grey hover:text-rs-v2-mint',
            )}
            onClick={() => onView('month')}
          >
            Month
          </Button>
          <Button
            className={cn(
              view === 'year'
                ? 'bg-rs-v2-dark-grey text-rs-v2-mint'
                : 'bg-rs-v2-navy-blue text-rs-v2-light-grey',
              'rounded-none rounded-r-[4px] hover:bg-rs-v2-dark-grey hover:text-rs-v2-mint',
            )}
            onClick={() => onView('year')}
          >
            Year
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CalendarToolbar;
