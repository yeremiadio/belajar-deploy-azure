import { FC } from 'react';
import { Cell, ColumnDef } from '@tanstack/react-table';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

import {
  TEmployeeActivity,
  TEmployeeStatus,
} from '@/types/api/employeeTracker';

import { BaseTable } from '@/components/Table/BaseTable';

type Props = {
  data: TEmployeeActivity[] | undefined;
};

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const renderBarChart = (cell: Cell<TEmployeeActivity, unknown>) => {
  const data = cell.getValue() as TEmployeeStatus[];
  const maxHours = 12;
  let workingHours =
    data.find((item) => item.status === 'In Working Station')?.duration || 0;
  const lateHours = data.find((item) => item.status === 'Late')?.duration || 0;

  let overtimeHours = 0;
  if (workingHours > 8) {
    overtimeHours = workingHours - 8;
    workingHours = 8;
  }

  const anomalyHours = maxHours - (workingHours + lateHours + overtimeHours);

  const chartData = {
    labels: ['Status'],
    datasets: [
      { label: 'Late', data: [lateHours], backgroundColor: '#FDAA09' },
      { label: 'Working', data: [workingHours], backgroundColor: '#20C997' },
      { label: 'Overtime', data: [overtimeHours], backgroundColor: '#3699FF' },
      {
        label: 'Location Anomaly',
        data: [anomalyHours],
        backgroundColor: '#58657A',
      },
    ],
  };

  const options = {
    indexAxis: 'y' as const,
    plugins: {
      datalabels: {
        display: false,
      },
      title: {
        display: false,
      },
      legend: {
        display: false,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { display: false, stacked: true },
      y: { display: false, stacked: true },
    },
    elements: {
      bar: {
        borderWidth: 2,
        borderSkipped: 'start' as const,
      },
    },
  };

  return (
    <div className="relative h-16 w-full overflow-x-auto">
      <Bar data={chartData} options={options} />
    </div>
  );
};

const headerBarChart = () => {
  const chartData = {
    labels: [''],
    datasets: [{ label: '', data: [12], backgroundColor: 'transparent' }],
  };

  const options = {
    indexAxis: 'y' as const,
    plugins: {
      datalabels: {
        display: false,
      },
      title: {
        display: false,
      },
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
            color: 'white',
          },
          mirror: true,
          callback: function (value: string | number | Date) {
            return value + 'h';
          },
          autoSkip: false,
          maxRotation: 0,
          minRotation: 0,
          autoSkipPadding: 0,
          maxTicksLimit: 13,
          min: 0,
          max: 12,
          stepSize: 1,
        },
      },
      y: {
        display: false,
      },
    },
  };

  return (
    <div className="relative h-14 w-full overflow-x-auto">
      <Bar data={chartData} options={options} />
    </div>
  );
};

const columns: ColumnDef<TEmployeeActivity>[] = [
  {
    accessorKey: 'employeeName',
    header: 'Employee Name',
  },
  {
    accessorKey: 'employeeId',
    header: 'Employee ID',
  },
  {
    accessorKey: 'activeTime',
    header: 'Active Time',
  },
  {
    accessorKey: 'employeeStatus',
    header: headerBarChart,
    cell: (context) => renderBarChart(context.cell),
  },
];

const ActivityTable: FC<Props> = ({ data }) => {
  return <BaseTable data={data ?? []} columns={columns} />;
};

export default ActivityTable;
