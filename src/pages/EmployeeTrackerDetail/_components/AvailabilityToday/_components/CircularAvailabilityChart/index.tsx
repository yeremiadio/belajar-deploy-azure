import { FC } from "react";

import { CircularGaugeChart } from "@/components/Chart/CircularGaugeChart";

type Props = {
  value: number;
};

const CircularAvailabilityChart: FC<Props> = ({ value }) => {
  const percent = value;
  const max_value = 100;

  const dataChart = {
    datasets: [
      {
        label: "",
        data: [percent, max_value - percent],
        backgroundColor: ["#00E39E", "#354358"],
        borderWidth: 0,
        cutout: "80%",
        circumference: 360,
        rotation: 360,
      },
    ],
  };

  return (
    <div className="relative h-40 w-40">
      <CircularGaugeChart
        className="relative"
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

export default CircularAvailabilityChart;
