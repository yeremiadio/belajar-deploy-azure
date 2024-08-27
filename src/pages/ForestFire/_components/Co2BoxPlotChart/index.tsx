import { ChartConfiguration } from 'chart.js';
import { FC } from 'react';

import BoxPlotChart from '@/components/Chart/BoxPlotChart';

type Props = {
  whiskerData: { label: string[]; data: number[][] };
};

const Co2BoxPlotChart: FC<Props> = ({ whiskerData }) => {
  const data: ChartConfiguration<'boxplot'>['data'] = {
    labels: whiskerData.label.slice(0, whiskerData.data.length),
    datasets: [
      {
        label: 'Dataset 1',
        borderColor: '#00BCD4',
        backgroundColor: '#5AF2FC4D',
        data: whiskerData.data,
      },
    ],
  };

  return <BoxPlotChart data={data} />;
};

export default Co2BoxPlotChart;
