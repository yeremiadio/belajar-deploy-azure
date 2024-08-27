import dayjs from 'dayjs';
import { FC } from 'react';

import { DoughnutChart } from '@/components/Chart/DoughnutChart';
import { cn } from '@/lib/utils';
import { doughnutChartCanvasDesc } from '@/utils/functions/tuningCopilot/canvasDescription';
import { useBreakPoint } from '@/utils/hooks/useBreakpoint';

interface Props {
  mass_concentration: number;
  lastUpdate:string;
  className?: string;
}

export const MassConcetrationEffeciencyGaugeChart: FC<Props> = ({
  mass_concentration,
  lastUpdate,
  className,
}) => {
  const { lowerThanBreakpoint } = useBreakPoint(1024);

  const max_value = 2;

  const dataChart = {
    labels: ['Mass Concetration Effeciency', ''],
    datasets: [
      {
        label: '',
        data: [mass_concentration, max_value - mass_concentration],
        backgroundColor: ['#00E39E', 'rgba(0, 227, 158, 0.2)'],
        borderWidth: 0,
        cutout: '60%',
        circumference: 220,
        rotation: 250,
      },
    ],
  };

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <DoughnutChart
        className="translate-y-[-1rem]"
        data={dataChart}
        description={doughnutChartCanvasDesc(
          dataChart,
          'Mass Concetration Effeciency',
        )}
        options={{
          responsive: true,
          plugins: {
            legend: {
              display: false,
            },
            title: {
              display: false,
            },
            tooltip: {
              enabled: false,
            },
            datalabels: {
              display: false,
            },
          },
        }}
      />
      <div className="absolute flex translate-y-2 flex-col items-center">
        <p className="text-xl font-bold">{mass_concentration}</p>
        <p className="text-sm">mg/m3</p>
      </div>
      <p
        className={cn(
          'absolute mt-2 text-center text-xs text-rs-neutral-steel-gray',
          lowerThanBreakpoint ? 'translate-y-12' : 'translate-y-16',
        )}
      >
        last update : <br className={cn(lowerThanBreakpoint && 'hidden')} />{' '}
        {dayjs().format('DD MMM YYYY')},{' '}
        {lastUpdate}
      </p>
    </div>
  );
};
