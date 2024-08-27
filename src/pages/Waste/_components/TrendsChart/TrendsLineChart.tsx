import { FC } from 'react';
import dayjs from 'dayjs';

import { LineChart } from '@/components/Chart/LineChart';

import { TChartRanges } from '@/types/api';
import { TValueChart, TWasteDevice } from '@/types/api/wasteMonitoring';


type ChartProps = {
  data?: TValueChart[];
  searchRanges: TChartRanges;
  devicesList?: TWasteDevice[];
  unit?: string
};

const processTrendData = (
  data: TValueChart[],
  searchRanges: TChartRanges,
) => {
  const formatDate = (date: string) => {
    switch (searchRanges) {
      case 'WEEK':
        return dayjs(date).format('DD/MM');
      case 'MONTH':
        return dayjs(date).format('DD/MM');
      case 'YEAR':
        return dayjs(date).format('YYYY');
      default:
        return dayjs(date).format('DD/MM');
    }
  };

  const deviceData: { [key: number]: { labels: string[]; values: number[] } } =
    {};
  data.forEach((entry) => {
    const { deviceId, receivedon, value } = entry;
    if (!deviceData[deviceId]) {
      deviceData[deviceId] = { labels: [], values: [] };
    }
    deviceData[deviceId].labels.push(formatDate(receivedon));
    deviceData[deviceId].values.push(value);
  });

  return deviceData;
};

const TrendsLineChart: FC<ChartProps> = ({
  data: trendData = [],
  searchRanges,
  devicesList,
  unit,
}) => {
  const deviceData = processTrendData(trendData, searchRanges);
  const allLabels = new Set<string>();
  Object.values(deviceData).forEach((device) => {
    device.labels.forEach((label) => allLabels.add(label));
  });
  const sortedLabels = Array.from(allLabels).sort(
    (a, b) => dayjs(a, 'DD/MM').valueOf() - dayjs(b, 'DD/MM').valueOf(),
  );

  const datasets = Object.keys(deviceData).map((deviceId, index) => {
    const device = deviceData[Number(deviceId)];
    const deviceName = devicesList?.find(
      (item) => Number(item.id ?? 0) === Number(deviceId),
    )?.name

    return {
      label: `${deviceName ?? deviceId}`,
      data: sortedLabels.map((item) => {
        const idx = device.labels.indexOf(item);
        return idx !== -1 ? device.values[idx] : 0;
      }),
      fill: false,
      backgroundColor: `rgba(255, ${index * 150}, 0, 1)`,
      borderColor: `rgba(255, ${index * 150}, 0, 1)`,
      borderWidth: 1,
    };
  });

  const data = {
    labels: sortedLabels,
    datasets,
  };

  return (
    <LineChart
      data={data}
      options={{
        plugins: {
          legend: {
            display: true,
            position: 'right',
            align: 'start',
            maxWidth: 100,
            labels: {
              boxWidth: 7,
              boxHeight: 7,
              padding: 10,
              boxPadding: 5,
              borderRadius: 5
            },
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
                return `${value} ${unit}`;
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

export default TrendsLineChart;
