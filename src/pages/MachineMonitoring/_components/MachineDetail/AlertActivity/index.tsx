import dayjs from 'dayjs';
import { FC, useEffect, useState } from 'react';
import { MdSearch, MdWarning } from 'react-icons/md';

import { Input } from '@/components/ui/input';

import { selectLanguage } from '@/stores/languageStore/languageSlice';


import { localization } from '@/utils/functions/localization';
import useAppSelector from '@/utils/hooks/useAppSelector';
import { TSocketNotif } from '@/types/api/socket';
import { cn } from '@/lib/utils';

type ActivityLogProps = {
  id?: string | null;
  dataAlert: TSocketNotif[];
  isLoading: Boolean;
};

const AlertActivityLog: FC<ActivityLogProps> = ({dataAlert, isLoading}) => {
  const [search, setSearch] = useState('');
  const [filteredLogs, setFilteredLogs] = useState<TSocketNotif[]>(dataAlert);

  const language = useAppSelector(selectLanguage);

  useEffect(() => {
    if (dataAlert && search) {
      setFilteredLogs(
        dataAlert.filter((log) =>
          log.sensor.name.toLowerCase().includes(search.toLowerCase()),
        ),
      );
    } else {
      setFilteredLogs(dataAlert);
    }
  }, [dataAlert, search]);

  return (
    <div className="flex flex-col gap-4 px-2 w-full h-full">
      <h1 className="h-fit text-start text-xl">
        {localization('Alert Activity', language)}
      </h1>
      <Input
        addonRight={<MdSearch className="w-[24px] h-[24px]" />}
        className="border-[1px] bg-rs-v2-navy-blue border-rs-v2-thunder-blue"
        type="search"
        placeholder="Search Log..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="flex flex-col gap-2 w-full h-[250px] overflow-y-auto">
        {filteredLogs.length > 0 ?
        filteredLogs.map((log, index) => {
          const isWarning = log.status === "WARNING"
          const isCritical = log.status === "CRITICAL"
          return (
          <div
            key={index}
            className="flex flex-col gap-2 bg-rs-v2-galaxy-blue p-3 rounded-md w-full h-fit"
          >
            <div className="flex flex-row justify-between items-center">
              <span className="text-rs-neutral-gray-gull text-sm">
                {log.sensor.name}
              </span>
              <MdWarning className={cn('text-2xl',
                 isWarning && 'text-rs-alert-yellow',
                 isCritical && 'text-rs-alert-danger',
               )} />
            </div>
            <hr className="border-[1px] border-rs-v2-gunmetal-blue w-full" />
            <div className="flex flex-row justify-between items-center">
              <span className="text-rs-neutral-gray-gull text-xs">
                {log ? (
                  <>
                    <span>
                      {dayjs(log?.time).format(
                        'D MMM YYYY',
                      )}
                    </span>
                    <span className='mx-2'>•</span>
                    <span>
                      {dayjs(log?.time).format(
                        'HH:mm',
                      )}
                    </span>
                  </>
                ) : (
                  '-'
                )}
              </span>
              <span className={cn('text-xs',
                 isWarning && 'text-rs-alert-yellow',
                 isCritical && 'text-rs-alert-danger',
               )}> {log.value}</span>
            </div>
          </div>
          )}) : 
          <div className="flex flex-row justify-center items-center gap-2 bg-rs-v2-galaxy-blue p-3 rounded-md w-full h-10">
            <span className="text-rs-neutral-gray-gull text-sm">
            {isLoading ? 'Loading your data...' : 'Data not found'}
            </span>
          </div>
        }
      </div>
    </div>
  );
};

export default AlertActivityLog;
