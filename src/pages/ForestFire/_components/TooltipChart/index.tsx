import { ChartData } from 'chart.js';
import { FC } from 'react';

import { LineChart } from '@/components/Chart/LineChart';
import { lineChartCanvasDesc } from '@/utils/functions/tuningCopilot/canvasDescription';

type Props = {
  /**
   * TIME CHART labels need to be timestamp in unit epoch (number)
   */
  chartData: ChartData<'line', number[], number>;
  unit: string;
};

export const TooltipChart: FC<Props> = ({
  chartData,
  unit,
}) => {
  return (
    <LineChart
      // @ts-ignore
      data={chartData}
      description={lineChartCanvasDesc(
        // @ts-ignore
        chartData,
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
            // ticks: {
            //   stepSize: 1,
            // },
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
