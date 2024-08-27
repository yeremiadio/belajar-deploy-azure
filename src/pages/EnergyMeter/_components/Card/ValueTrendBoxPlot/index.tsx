import { ChartConfiguration } from 'chart.js';
import { useParams } from 'react-router-dom';

import BoxPlotChart from '@/components/Chart/BoxPlotChart';

import { selectLanguage } from '@/stores/languageStore/languageSlice';
import { useGetSensorlogSummariesQuery } from '@/stores/sensorlogSummariesStore/sensorlogSummariesStoreApi';

import { localization } from '@/utils/functions/localization';
import {
  filteredWhiskerDataObjects,
  whiskerData,
} from '@/utils/functions/sanitizeDataWhiskerChart';
import useAppSelector from '@/utils/hooks/useAppSelector';

const ValueTrendBoxPlot = () => {
  const language = useAppSelector(selectLanguage);
  const DEFAULT_TYPE = 'MONTH';
  const { gatewayId } = useParams<'gatewayId'>();
  const {
    data: sensorlogSummariesData,
    isLoading,
    isFetching,
  } = useGetSensorlogSummariesQuery(
    {
      type: DEFAULT_TYPE,
      /**
       * @todo refactor this soon
       */
      gatewayId: parseInt(gatewayId!),
    },
    { skip: !gatewayId },
  );
  const loading = isLoading || isFetching;

  const filteredSensorLogSummaries = filteredWhiskerDataObjects(
    sensorlogSummariesData ?? [],
    'edel',
  );

  const whiskerSensorlogSummaries = whiskerData(filteredSensorLogSummaries, {
    type: DEFAULT_TYPE,
  });
  // console.log(whiskerSensorlogSummaries.label);
  // console.log(whiskerSensorlogSummaries.data);

  const data: ChartConfiguration<'boxplot'>['data'] = {
    labels: whiskerSensorlogSummaries.label.slice(
      0,
      whiskerSensorlogSummaries.data.length,
    ),
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
    <div className="box-border flex h-[300px] flex-col overflow-hidden rounded-xl border-2 border-rs-v2-thunder-blue bg-rs-v2-navy-blue p-6 md:col-span-2 xl:h-auto">
      <div className="flex flex-wrap items-start justify-between">
        <div className="flex flex-col">
          <h1 className="text-lg font-medium text-rs-neutral-silver-lining md:text-xl 2xl:text-2xl">
            {localization('Trend Total Energy', language)}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <p className="whitespace-nowrap text-base text-rs-v2-light-grey">
            {localization('Week', language)}
          </p>
          <div className="rounded-md bg-rs-v2-dark-grey px-2 pb-[7px] pt-[3px] md:px-[10px]">
            <span className="whitespace-nowrap text-[10px] font-medium text-rs-v2-mint md:text-xs 2xl:text-sm">
              {localization('Month', language)}
            </span>
          </div>
          <p className="whitespace-nowrap text-base text-rs-v2-light-grey">
            {localization('Year', language)}
          </p>
        </div>
      </div>
      {!loading ? (
        <div className="box-border h-full w-full overflow-hidden overflow-x-auto">
          {/* content */}
          <BoxPlotChart
            data={data}
            options={{
              scales: {
                y: {
                  min: 10,
                  grid: {
                    display: true,
                  },
                  ticks: {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    callback: (value: any) => {
                      return `${value} kWh`;
                    },
                    stepSize: 10,
                  },
                },
                x: {
                  grid: {
                    display: false,
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
  //   return <BoxPlotChart data={data} />;
};

export default ValueTrendBoxPlot;
