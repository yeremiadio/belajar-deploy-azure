import { FC } from 'react';
import { TValueOEE } from '@/types/api/machineMonitoring';
import { CircularGaugeChart } from './CircularGaugeChart';

type Props = {
  deviceData: TValueOEE | undefined;
  isActive: Boolean;
};

const OEECard: FC<Props> = ({ isActive, deviceData }) => {
  const percent = deviceData?.oee ?? 0
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
        backgroundColor: [getColorChartOee(percent), '#354358'],
        cutout: '80%',
        borderWidth: 0,
        circumference: 360,
        rotation: 360,
      },
    ],
  };

  return (
    <div className="flex flex-col gap-4 bg-transparent px-5 border-none h-full">
      <h1 className="text-l text-start">OEE</h1>
      <div className="flex flex-col justify-center items-center gap-4 h-full">
        <div className="flex items-center w-full h-full">
          <div className="flex-shrink-0 w-[150px] h-[150px]">
            <CircularGaugeChart
              className="relative top-[5%] text-2xl text-black lg:text-2xl xl:text-2xl"
              data={dataChart}
              options={{
                plugins: {
                  legend: { display: false },
                  title: { display: false },
                  tooltip: { enabled: false },
                  datalabels: { display: false },
                },
              }}
              percent={percent}
            />
          </div>
          <div className="flex-1 pl-4">
            <p className="text-rs-v2-galaxy-blue">
              {`An OEE (Overall Equipment Effectiveness) score of ${percent} is considered very high and indicates exceptional performance in a manufacturing environment. Here are some conclusions that can be drawn from an accumulated OEE value of ${percent}.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OEECard;
