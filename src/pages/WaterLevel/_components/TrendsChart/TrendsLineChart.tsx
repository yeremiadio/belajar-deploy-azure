import { FC } from 'react';
import dayjs from 'dayjs';

import { LineChart } from '@/components/Chart/LineChart';

import { TValueChart, TWaterLevelRanges } from '@/types/api/waterLevel';
import { IDeviceLocationWaterLevelObj } from '@/types/api/ews';

type AvailabilityChartProps = {
  data?: TValueChart[];
  searchRanges: TWaterLevelRanges;
  devicesList?: IDeviceLocationWaterLevelObj[];
};

const processTrendData = (
  data: TValueChart[],
  searchRanges: TWaterLevelRanges,
) => {
  const formatDate = (date: string) => {
    switch (searchRanges) {
      case 'DAY':
        return dayjs(date).format('HH:mm');
      case 'MONTH':
        return dayjs(date).format('DD/MM');
      case 'YEAR':
        return dayjs(date).format('YYYY');
      default:
        return dayjs(date).format('HH:mm');
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

const TrendsLineChart: FC<AvailabilityChartProps> = ({
  data: trendData = [],
  searchRanges,
  devicesList,
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
      (item) => Number(item?.device_summary?.id ?? 0) === Number(deviceId),
    )?.device_summary?.name;

    return {
      label: `Device ${deviceName ?? deviceId}`,
      data: sortedLabels.map((item) => {
        const idx = device.labels.indexOf(item);
        return idx !== -1 ? device.values[idx] : 0;
      }),
      fill: false,
      backgroundColor: `rgba(${index * 50}, ${index * 100}, 192, 0.2)`,
      borderColor: `rgba(${index * 50}, ${index * 100}, 192, 1)`,
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
            labels: {
              boxWidth: 7,
              boxHeight: 7,
              padding: 10,
              boxPadding: 5,
              borderRadius: 5,
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
                return `${value} cm`;
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
