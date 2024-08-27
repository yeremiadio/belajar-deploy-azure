import { ChartData } from 'chart.js';
import { FC } from 'react';

import { LineChart } from '@/components/Chart/LineChart';

import { lineChartCanvasDesc } from '@/utils/functions/tuningCopilot/canvasDescription';

import { LineChartData } from '@/types/tuningCopilot/canvasDescription';

type Props = {
  chartData: ChartData<'line', number[], number>;
  unit: string;
};

export const SmartpoleChart: FC<Props> = ({ chartData, unit }) => {
  return (
    <LineChart
      data={chartData as unknown as ChartData<'line', number[], string>}
      description={lineChartCanvasDesc(
        chartData as unknown as LineChartData,
        'mass concentration effeciency at each hours',
        'mass concentration effeciency',
      )}
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
            top: 10,
            right: 10,
            bottom: 5,
            left: 5,
          },
        },
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'minute',
              displayFormats: {
                minute: 'HH:mm',
              },
            },
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
              precision: 0,
              maxTicksLimit: 10,
            },
          },
        },
      }}
    />
  );
};
