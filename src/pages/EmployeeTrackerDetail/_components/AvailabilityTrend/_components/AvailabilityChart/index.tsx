import { FC } from "react";
import dayjs from "dayjs";

import { TEmployeeAvailabilityTrend } from "@/types/api/employeeTracker";

import { LineChart } from "@/components/Chart/LineChart";

type AvailabilityChartProps = {
  data?: TEmployeeAvailabilityTrend[];
};

const AvailabilityChart: FC<AvailabilityChartProps> = ({ data: trendData }) => {
  // const data = {
  //   labels: [
  //     "January",
  //     "February",
  //     "March",
  //     "April",
  //     "May",
  //     "June",
  //     "July",
  //     "August",
  //     "September",
  //     "October",
  //     "November",
  //     "December",
  //   ].map((label) => label.substring(0, 3)),
  //   datasets: [
  //     {
  //       label: "My First dataset",
  //       data: [65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56],
  //       fill: false,
  //       borderColor: "rgb(75, 192, 192)",
  //       borderWidth: 1,
  //       tension: 0.4,
  //       pointRadius: 0,
  //     },
  //   ],
  // };

  const data = {
    labels: trendData?.map((item) => dayjs(item.date.replace(",", ".")).format("D MMM")),
    datasets: [
      {
        label: "My First dataset",
        data: trendData?.map((item) => item.availability) || [],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        borderWidth: 1,
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  };

  return (
    <LineChart
      data={data}
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
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              display: true,
            },
          },
          y: {
            grid: {
              display: true,
              color: "#2c394a",
            },
            ticks: {
              display: true,
              stepSize: 20,
            },
          },
        },
      }}
    />
  );
};

export default AvailabilityChart;
