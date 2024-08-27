import { useParams, useSearchParams } from 'react-router-dom';

import {
    useGetEmployeeActivitiesQuery
} from '@/stores/employeeTrackerStore/employeeTrackerStoreApi';
import { activityIndicators } from '@/utils/dummies/staticEmployeeActivities';

import ActivityIndicator from './_components/ActivityIndicator';
import ActivityTable from './_components/ActivityTable';
import ShiftTab from './_components/ShiftTab';
import TableFilter from './_components/TableFilter';

const EmployeeActivities = () => {
  const [searchParams] = useSearchParams();
  const shiftParams = searchParams.get('shift');

  const { gatewayId } = useParams<'gatewayId'>();

  const { data: employeeActivityData } = useGetEmployeeActivitiesQuery({
    shift: Number(shiftParams) || 1,
    gatewayId: gatewayId ? Number(gatewayId) : undefined,
  });

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex h-auto flex-wrap justify-between gap-4">
        <TableFilter />
        <div className="flex flex-wrap gap-2">
          <ShiftTab />
          <ActivityIndicator activities={activityIndicators} />
        </div>
      </div>
      <ActivityTable data={employeeActivityData} />
    </div>
  );
};

export default EmployeeActivities;
