import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { cn } from '@/lib/utils';
import { RootState } from '@/stores';
import {
    useGetEmployeeLocationsQuery
} from '@/stores/employeeTrackerStore/employeeTrackerStoreApi';
import { TEmployeeLocationDetail } from '@/types/api/employeeTracker';

import EmployeeLocation from './_components/EmployeeLocation';
import EmployeeSummary from './_components/EmployeeSummary';

const LocationMonitoring = () => {
  const [selectedEmployee, setSelectedEmployee] =
    useState<TEmployeeLocationDetail>();
  const { isCopilotOpen } = useSelector(
    ({ toggleCopilotSlice }: RootState) => toggleCopilotSlice,
  );
  const { gatewayId } = useParams<'gatewayId'>();
  const { data } = useGetEmployeeLocationsQuery({
    gatewayId: gatewayId ? Number(gatewayId) : undefined,
  });

  const toggleSelectedEmployee = (employee: TEmployeeLocationDetail) => {
    if (selectedEmployee === employee) {
      setSelectedEmployee(undefined);
    } else {
      setSelectedEmployee(employee);
    }
  };

  return (
    <div
      className={cn(
        'grid w-full grid-cols-1 grid-rows-2 gap-4 md:grid-cols-2 md:grid-rows-1 lg:grid-cols-[320px_auto] lg:grid-rows-1',
        isCopilotOpen
          ? 'md:grid-cols-1 md:grid-rows-2 lg:grid-cols-[320px_auto] lg:grid-rows-1'
          : '',
      )}
    >
      <EmployeeSummary
        selectedEmployee={selectedEmployee}
        toggleSelectedEmployee={toggleSelectedEmployee}
      />
      <EmployeeLocation
        data={data}
        selectedEmployee={selectedEmployee}
        toggleSelectedEmployee={toggleSelectedEmployee}
      />
    </div>
  );
};

export default LocationMonitoring;
