import { ChartData } from 'chart.js';
import { FC } from 'react';

import { LineChart } from '@/components/Chart/LineChart';

import { lineChartCanvasDesc } from '@/utils/functions/tuningCopilot/canvasDescription';

import { LineChartData } from '@/types/tuningCopilot/canvasDescription';

type Props = {
  chartData: ChartData<'line', number[], number>;
  unit: string;
  timeRange: number;
};

export const Chart: FC<Props> = ({ chartData, unit, timeRange }) => {
  let timeScale:
    | 'false'
    | 'millisecond'
    | 'second'
    | 'minute'
    | 'hour'
    | 'day'
    | 'week'
    | 'month'
    | 'quarter'
    | 'year'
    | undefined = 'minute';

  let maxTicksLimit = 15;

  switch (timeRange) {
    case 24:
      timeScale = 'minute';
      break;
    case 720:
      timeScale = 'day';
      break;
    case 8640:
      timeScale = 'month';
      break;
    default:
      timeScale = 'minute';
      break;
  }

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
              unit: timeScale,
              displayFormats: {
                minute: 'HH:mm',
              },
            },

            offset: true,
            grid: {
              display: false,
            },
            ticks: {
              maxTicksLimit: maxTicksLimit,
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
