import { ScriptableContext } from 'chart.js';

import { LineChart } from '@/components/Chart/LineChart';
import { TChart } from '@/types/api/ews/ewsForestFire';
import addAlphatoHexColor from '@/utils/functions/addAlphaToHexColor';
import { getColorByCo2Threshold } from '@/utils/functions/co2Threshold';
import { lineChartCanvasDesc } from '@/utils/functions/tuningCopilot/canvasDescription';

type Props = {
  chartData: TChart | null;
  averagePPM: number;
};

export default function Co2LineChart({ chartData, averagePPM }: Props) {
  const DEFAULT_COLOR = getColorByCo2Threshold(averagePPM);

  const dataChartForestFire = {
    labels: chartData?.time,
    datasets: [
      {
        label: '',
        data: chartData?.value ?? [],
        borderColor: DEFAULT_COLOR,
        pointRadius: 4,
        borderWidth: 1,
        color: 'white',
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
      data={dataChartForestFire}
      description={lineChartCanvasDesc(
        dataChartForestFire,
        'co2 at each hours',
        'co2',
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
                return `${label}: ${value} ppm`;
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
