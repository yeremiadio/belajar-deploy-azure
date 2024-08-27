import { ChartConfiguration } from 'chart.js';

import BoxPlotChart from '@/components/Chart/BoxPlotChart';

import { useGetSensorlogSummariesQuery } from '@/stores/sensorlogSummariesStore/sensorlogSummariesStoreApi';

import {
  filteredWhiskerDataObjects,
  whiskerData,
} from '@/utils/functions/sanitizeDataWhiskerChart';

const WaterDepthPlotChart = () => {
  const DEFAULT_TYPE = 'DAY';
  const {
    data: sensorlogSummariesData,
    isLoading,
    isFetching,
  } = useGetSensorlogSummariesQuery({
    type: DEFAULT_TYPE,
    deviceId: 318,
  });
  const loading = isLoading || isFetching;

  const filteredSensorLogSummaries = filteredWhiskerDataObjects(
    sensorlogSummariesData ?? [],
    'wlvl123',
  );

  const whiskerSensorlogSummaries = whiskerData(filteredSensorLogSummaries, {
    type: DEFAULT_TYPE,
  });

  const data: ChartConfiguration<'boxplot'>['data'] = {
    labels: whiskerSensorlogSummaries.label,
    datasets: [
      {
        label: 'Dataset 1',
        borderColor: '#00BCD4',
        backgroundColor: '#5AF2FC4D',
        data: whiskerSensorlogSummaries.data,
      },
    ],
  };
  return (
    <div className="box-border flex flex-col overflow-hidden rounded-xl border-2 border-rs-v2-thunder-blue bg-rs-v2-navy-blue p-6 xl:h-auto">
      {!loading ? (
        <div className="box-border h-full w-full overflow-hidden overflow-x-auto">
          <BoxPlotChart
            data={data}
            options={{
              scales: {
                y: {
                  min: 10,
                  grid: {
                    display: false,
                  },
                  ticks: {
                    callback: (value: string | number) => {
                      return `${value}`;
                    },
                    stepSize: 10,
                  },
                },
              },
            }}
          />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default WaterDepthPlotChart;
