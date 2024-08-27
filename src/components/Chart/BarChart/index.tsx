import { CSSProperties, FC } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  CoreChartOptions,
  ElementChartOptions,
  PluginChartOptions,
  DatasetChartOptions,
  ScaleChartOptions,
  BarControllerChartOptions,
} from "chart.js";
import 'chartjs-plugin-zoom';

import { _DeepPartialObject } from "node_modules/chart.js/dist/types/utils";

ChartJS.register(BarElement, Title, Tooltip, Legend);

ChartJS.defaults.font.family = "Plus Jakarta Sans";
ChartJS.defaults.color = "#fff";
ChartJS.defaults.font.size = 9;

type Props = {
  data: ChartData<"bar", number[], string>;
  height?: number;
  width?: number;
  style?: CSSProperties | undefined;
  options?: _DeepPartialObject<
    | (CoreChartOptions<"bar"> &
        ElementChartOptions<"bar"> &
        PluginChartOptions<"bar"> &
        DatasetChartOptions<"bar"> &
        ScaleChartOptions<"bar"> &
        BarControllerChartOptions)
    | undefined
  >;
};

export const BarChart: FC<Props> = ({
  data,
  width,
  height,
  style,
  options,
}) => {
  return (
    <Bar
      data={data}
      width={width}
      height={height}
      style={style}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        color: "#fff",
        font: {
          family: "Plus Jakarta Sans",
          size: 9,
        },
        ...options,
      }}
    />
  );
};
