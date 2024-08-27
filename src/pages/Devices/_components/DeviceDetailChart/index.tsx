import { FC } from 'react';

import { LineChart } from '@/components/Chart/LineChart';
import { lineChartCanvasDesc } from '@/utils/functions/tuningCopilot/canvasDescription';
import { ChartData } from 'chart.js';
import useWindowDimensions from '@/utils/hooks/useWindowDimension';

type Props = {
  /**
   * TIME CHART labels need to be timestamp in unit epoch (number)
   */
  chartData: ChartData<'line', number[], number>;
  unit: string;
};

export const DeviceDetailChart: FC<Props> = ({ chartData, unit }) => {
  const { width } = useWindowDimensions();
  return (
    <LineChart
      // @ts-ignore
      data={chartData}
      description={lineChartCanvasDesc(
        // @ts-ignore
        chartData,
        'device total energy in each hours',
        'device total energy',
      )}
      options={{
        maintainAspectRatio: true,
        plugins: {
          title: {
            display: false,
          },
          legend: {
            display: false,
          },
          datalabels: {
            display: false,
          },
          tooltip: {
            bodyFont: {
              size:
                width >= 1440 && width < 1620
                  ? 16
                  : width >= 1620 && width < 1920
                    ? 20
                    : width >= 1920
                      ? 26
                      : 12,
            },
            callbacks: {
              label: (tooltipItem) => {
                const label = tooltipItem?.label;
                const value = tooltipItem?.formattedValue;
                return `${label}: ${value} ${unit}`;
              },
            },
          },
        },
        scales: {
          x: {
            border: {
              display: false,
            },
            grid: {
              display: false,
            },
            /**
             * @todo Will created as a hooks later
             */
            type: 'time',
            time: {
              unit: 'hour',
              displayFormats: {
                hour: 'HH:mm',
              },
            },
            ticks: {
              font: {
                size:
                  width >= 1620 && width < 1920 ? 14 : width >= 1920 ? 16 : 12,
              },
            },
          },
          y: {
            min: 10,
            border: {
              display: false,
            },
            grid: {
              display: true,
              color: '#2C394A',
            },
            ticks: {
              callback: (value) => {
                return `${value} ${unit}`;
              },
              stepSize: 10,
              font: {
                size:
                  width >= 1620 && width < 1920 ? 14 : width >= 1920 ? 16 : 12,
              },
            },
          },
        },
      }}
    />
  );
};
