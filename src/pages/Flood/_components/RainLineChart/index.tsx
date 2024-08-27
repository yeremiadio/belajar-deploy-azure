import { ScriptableContext } from 'chart.js';

import { LineChart } from '@/components/Chart/LineChart';
import { TChart } from '@/types/api/ews/ewsFlood';
import addAlphatoHexColor from '@/utils/functions/addAlphaToHexColor';
import { lineChartCanvasDesc } from '@/utils/functions/tuningCopilot/canvasDescription';

type Props = {
  // Refactor when API is ready
  chartData: TChart| undefined;
};

export default function RainLineChart({ chartData }: Props) {
  const DEFAULT_COLOR = '#009FE3';

  const dataChart = {
    labels: chartData?.time ? chartData.time.slice(-5) : [],
    datasets: [
      {
        label: 'Rain Gauge',
        data: chartData?.value ? chartData.value.slice(-5) : [],
        borderColor: DEFAULT_COLOR,
        pointRadius: 4,
        borderWidth: 1,
        fill: true, // Set fill to true to enable the backgroundColor under the line
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
        dataChart as any,
        'rain gauge in each hours',
        'rain gauge',
      )}
      options={{
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: false,
          },
          datalabels: {
            display: false,
          },
          tooltip: {
            bodyFont: {
              size: 12,
            },
            callbacks: {
              label: (tooltipItem) => {
                const label = tooltipItem.label;
                const value = tooltipItem.formattedValue;
                return `${label}: ${value} mm`;
              },
            },
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
          },
          y: {
            grid: {
              display: true,
              tickWidth: 0,
              color: '#374151',
              lineWidth: 2,
            },
          },
        },
      }}
    />
  );
}
