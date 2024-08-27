import dayjs from 'dayjs';
import { FC, useEffect, useState } from 'react';
import { MdSearch } from 'react-icons/md';
import { useParams } from 'react-router-dom';

import { Input } from '@/components/ui/input';
import { useGetEmpActivityLogQuery } from '@/stores/employeeTrackerStore/employeeTrackerStoreApi';
import { selectLanguage } from '@/stores/languageStore/languageSlice';
import { localization } from '@/utils/functions/localization';
import useAppSelector from '@/utils/hooks/useAppSelector';

type ActivityLogProps = {
  id?: string | null;
};

const ActivityLog: FC<ActivityLogProps> = ({ id }) => {
  const { gatewayId } = useParams<'gatewayId'>();
  const { data: logsData } = useGetEmpActivityLogQuery({
    id: id || '1',
    gatewayId: gatewayId ? Number(gatewayId) : undefined,
  });
  const [search, setSearch] = useState('');
  const [filteredLogs, setFilteredLogs] = useState(logsData);

  const language = useAppSelector(selectLanguage);

  useEffect(() => {
    if (logsData && search) {
      setFilteredLogs(
        logsData.filter((log) =>
          log.status.toLowerCase().includes(search.toLowerCase()),
        ),
      );
    } else {
      setFilteredLogs(logsData);
    }
  }, [logsData, search]);

  return (
    <div className="flex flex-col gap-4 p-5 w-full h-full">
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

      <div className="flex flex-col gap-2 rounded-md w-full h-[250px] overflow-y-auto">
        {filteredLogs?.map((log, index) => (
          <div
            key={index}
            className="flex flex-row flex-shrink-0 justify-between items-center gap-2 bg-rs-v2-galaxy-blue p-3 rounded-md w-full h-fit overflow-x-auto"
          >
            <span className="text-sm">
              {localization('State', language)}
              {' : '}
              {localization(log?.status ?? '', language) + '.' || '-'}{' '}
              {localization('Location', language)}
              {' : '}
              {log?.location || '-'}.
            </span>
            <span className="text-end text-rs-neutral-gray-gull text-xs">
              {log ? dayjs(log?.date).format('D MMM YYYY, HH:mm') : '-'}
            </span>
          </div>
        ))}

        {(!filteredLogs || !filteredLogs?.length) && (
          <div className="flex flex-row justify-center items-center gap-2 bg-rs-v2-galaxy-blue p-3 rounded-md w-full h-10">
            <span className="text-rs-neutral-gray-gull text-sm">
              No logs found.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityLog;
