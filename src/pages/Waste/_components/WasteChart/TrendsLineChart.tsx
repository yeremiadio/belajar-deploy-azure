import { ChartData } from 'chart.js';
import { FC } from 'react';

import { LineChart } from '@/components/Chart/LineChart';



type Props = {
  chartData: ChartData<'line', number[], string>;
  unit: string;
};

export const TrendsLineChart: FC<Props> = ({
  chartData,
  unit
}) => {
  return (
    <LineChart
          // @ts-ignore
      data={chartData}
      options={{
        plugins: {
          legend: {
            display: false,
            position: 'right',
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
        layout: {
          padding: {
            top: 5,
            right: 5,
            left: 5,
          },
        },
        scales: {
          x: {
            offset: true,
            grid: {
              display: false,
            },
            ticks: {
              maxTicksLimit: 5,
            },
          },
          y: {
            offset: true,
            grid: {
              display: true,
              color: '#2c394a',
            },
            beginAtZero: true,
            ticks: {
              callback: (value: any) => {
                return `${value} ${unit}`;
              },
              display: true,
              // stepSize: 100,
              precision: 0,
              maxTicksLimit: 10,
            },
          },
        },
      }}
    />
  );
};
