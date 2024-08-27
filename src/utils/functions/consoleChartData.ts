// just use this for if you need to console.log

import { ChartData } from 'chart.js';
import dayjs from 'dayjs';

export const consoleChartData = (
  chartData: ChartData<'line', number[], number>,
) => {
  console.log(
    'label at 0',
    chartData?.labels ? dayjs(chartData.labels[0]).toString() : undefined,
  );
  console.log(
    'label at n -1',
    chartData?.labels
      ? dayjs(chartData.labels[chartData.labels.length - 1]).toString()
      : undefined,
  );
  const minData = chartData?.labels ? Math.min(...chartData.labels) : undefined;
  const maxData = chartData?.labels ? Math.max(...chartData.labels) : undefined;
  console.log('min', minData ? dayjs(minData).toString() : undefined);
  console.log('max', maxData ? dayjs(maxData).toString() : undefined);
  console.log('now', dayjs().toString());
  console.log('value at 0', chartData.datasets[0].data[0]);
};
