import dayjs from 'dayjs';

import { DoughnutChart } from '@/components/Chart/DoughnutChart';
import { cn } from '@/lib/utils';
import { getColorByCo2Threshold } from '@/utils/functions/co2Threshold';
import { doughnutChartCanvasDesc } from '@/utils/functions/tuningCopilot/canvasDescription';
import { useBreakPoint } from '@/utils/hooks/useBreakpoint';

type Props = {
  averagePPM: number;
  className?: string;
  lastUpdate?: string;
};

export default function Co2DoughnutChart({
  averagePPM,
  className,
  lastUpdate,
}: Props) {
  const { lowerThanBreakpoint } = useBreakPoint(1024);
  const dataDoughnutChartForestFire = {
    labels: ['Smoke', ''],
    datasets: [
      {
        label: '',
        data: [averagePPM, 500],
        backgroundColor: [
          getColorByCo2Threshold(averagePPM),
          getColorByCo2Threshold(averagePPM) + '20',
        ],
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
        className="mb-2 translate-y-[-1rem]"
        data={dataDoughnutChartForestFire}
        description={doughnutChartCanvasDesc(
          dataDoughnutChartForestFire,
          'Smoke Average',
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
        <p className="text-xl font-bold">{averagePPM}</p>
        <p className="text-sm">ppm</p>
      </div>
      <p
        className={cn(
          'absolute mb-4 mt-2 text-center text-xs text-rs-neutral-steel-gray',
          lowerThanBreakpoint ? 'mt-6 translate-y-12' : 'translate-y-16',
        )}
      >
        last update : <br /> {dayjs(lastUpdate).format('DD MMM YYYY, HH:mm')}
      </p>
    </div>
  );
}
