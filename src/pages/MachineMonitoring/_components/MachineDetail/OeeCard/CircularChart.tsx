import { FC } from "react";

import { CircularGaugeChart } from "@/components/Chart/CircularGaugeChart";

type Props = {
  value: number;
  is_Active: Boolean;
  className?: string;
};

const CircularChart: FC<Props> = ({ value, is_Active }) => {
  const percent = value;
  const max_value = 100;
  const getColorChartOee = (value: number): string => {
    if (is_Active) {
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
    <div className="relative w-[80px] h-[80px]">
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
  );
};

export default CircularChart;
