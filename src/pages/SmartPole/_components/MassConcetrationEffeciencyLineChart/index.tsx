import { ScriptableContext } from 'chart.js';
import { FC } from 'react';

import { LineChart } from '@/components/Chart/LineChart';
import addAlphatoHexColor from '@/utils/functions/addAlphaToHexColor';
import { lineChartCanvasDesc } from '@/utils/functions/tuningCopilot/canvasDescription';
import { TStatisticChart } from '@/types/api/smartPole';

type Props = {
  chartData: TStatisticChart | undefined;
  backgroundColor?: string;
};

export const MassConcetrationEffeciencyLineChart: FC<Props> = ({
  chartData,
  backgroundColor,
}) => {
  const DEFAULT_COLOR = backgroundColor ? backgroundColor : '#00E39E';

  const dataChart = {
    labels: chartData?.time?.length ? chartData?.time : ['11.00', '12.00'],
    datasets: [
      {
        label: 'value Trend',
        data: chartData?.value ? chartData?.value?.slice(-5) : [],
        borderColor: DEFAULT_COLOR,
        pointRadius: 4,
        borderWidth: 1,
        fill: true,
        backgroundColor: (context: ScriptableContext<'line'>) => {
          const chart = context.chart;
          const { ctx, width } = chart;
          const gradient = ctx.createLinearGradient(width * 1.5, 0, 0, 0);
          gradient.addColorStop(0.5, addAlphatoHexColor(DEFAULT_COLOR, 0.075));
          gradient.addColorStop(1, addAlphatoHexColor(DEFAULT_COLOR, 0.85));
          return gradient;
        },
      },
    ],
  };

  return (
    <LineChart
      data={dataChart}
      description={lineChartCanvasDesc(
        dataChart,
        'mass concetration effeciency at each hours',
        'mass concetration effeciency',
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
            offset: true,
            grid: {
              display: false,
            },
            ticks: {
              stepSize: 1,
            },
          },
          y: {
            offset: true,
            grid: {
              display: true,
              color: '#2c394a',
            },
            ticks: {
              callback: (value: any) => {
                const unit = chartData?.label;
                return `${value} ${unit ?? ''}`;
              },
              display: true,
              stepSize: 5,
            },
          },
        },
      }}
    />
  );
};
