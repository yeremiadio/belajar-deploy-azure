import { FC } from 'react';
import { EReportData } from '@/types/api/report';

import { TAdditionalFilterForm } from '@/pages/Report/_components/AdditionalFilterForm';

import LogTable from './_components/LogTable';

type Props = {
  selectedModule: number;
  selectedData: string;
  selectedDate: Date;
  additionalFilter: TAdditionalFilterForm;
  showAlertConfirmed?: boolean;
};

const ReportTable: FC<Props> = ({
  selectedModule,
  selectedData,
  selectedDate,
  additionalFilter,
  showAlertConfirmed,
}) => {
  switch (selectedData as keyof typeof EReportData) {
    case 'LOG':
      return (
        <LogTable
          selectedModule={selectedModule}
          selectedData={selectedData}
          selectedDate={selectedDate}
          additionalFilter={additionalFilter}
          showAlertConfirmed={showAlertConfirmed}
        />
      );
  }
};

export default ReportTable;
