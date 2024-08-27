import { FC } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  CoreChartOptions,
  ElementChartOptions,
  PluginChartOptions,
  DatasetChartOptions,
  ScaleChartOptions,
} from 'chart.js';
import {
  BoxPlotController,
  BoxAndWiskers,
  BoxPlotDataPoint,
} from '@sgratzl/chartjs-chart-boxplot';
import { Chart } from 'react-chartjs-2';

import { _DeepPartialObject } from 'node_modules/chart.js/dist/types/utils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  BoxPlotController,
  BoxAndWiskers,
);

type Props = {
  data: ChartData<'boxplot', BoxPlotDataPoint[], unknown>;
  options?: _DeepPartialObject<
    | (CoreChartOptions<'boxplot'> &
        ElementChartOptions<'boxplot'> &
        PluginChartOptions<'boxplot'> &
        DatasetChartOptions<'boxplot'> &
        ScaleChartOptions<'boxplot'>)
    | undefined
  >;
};

const BoxPlotChart: FC<Props> = ({ data, options }) => {
  return (
    <Chart
      type="boxplot"
      data={data}
      width={'100%'}
      height={'100%'}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            enabled: false,
          },
          legend: {
            display: false,
          },
          datalabels: {
            display: false,
          },
        },
        ...options,
      }}
    />
  );
};

export default BoxPlotChart;
