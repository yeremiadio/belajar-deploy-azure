import { FC } from 'react';

import Card from '@/components/Card';
import { CircularGaugeChart } from '@/components/Chart/CircularGaugeChart';

import { selectLanguage } from '@/stores/languageStore/languageSlice';

import { TValueOEE } from '@/types/api/machineMonitoring';

import { localization } from '@/utils/functions/localization';
import useAppSelector from '@/utils/hooks/useAppSelector';


type Props = {
  deviceData: TValueOEE | undefined;
  isActive: Boolean;
};


const OEECard: FC<Props> = ({ deviceData, isActive }) => {
  const language = useAppSelector(selectLanguage);

  const percent = deviceData?.oee ?? 0;

  const max_value = 100;
  const getColorChartOee = (value: number): string => {
    if (isActive) {
      if (value >= 60) {
        return '#20C997'; 
      } else if (value >= 40 && value < 60) {
        return '#FDAA09'; 
      } else {
        return '#FC5A5A'; 
      }
    } else {
      return '#354358'; 
    }
  };

  const dataChart = {
    labels: ['Electricity'],
    datasets: [
      {
        label: '',
        data: [percent, max_value - percent],
        backgroundColor: [getColorChartOee(percent), '#354358', ],
        cutout: '80%',
        borderWidth: 0,
        circumference: 360,
        rotation: 360,
      },
    ],
  };
  

  return (
    <Card className="flex flex-col gap-4 p-5 h-full">
      <h1 className="h-fit text-l text-start">
        {localization('OEE', language)}
      </h1>
      <div className="flex flex-col justify-center items-center gap-2 h-full">
        <div className="flex justify-center items-center w-full">
        <div className="relative w-[150px] h-[150px]">
        <CircularGaugeChart
          className="relative text-xl lg:text-xl xl:text-xl"
          data={dataChart}
          options={{
            plugins: {
              legend: {
                display: false,
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
          }}
          percent={percent}
        />
        </div>
        </div>
      </div>
    </Card>
  );
};

export default OEECard;
