import { CSSProperties, FC } from "react";
import { Line } from "react-chartjs-2";
import 'chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  CoreChartOptions,
  ElementChartOptions,
  PluginChartOptions,
  DatasetChartOptions,
  ScaleChartOptions,
  LineControllerChartOptions,
  Filler,
  TimeScale,
} from "chart.js";

import { _DeepPartialObject } from "node_modules/chart.js/dist/types/utils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TimeScale
);

ChartJS.defaults.font.family = "Plus Jakarta Sans";
ChartJS.defaults.color = "#fff";
ChartJS.defaults.font.size = 9;

type Props = {
  data: ChartData<"line", number[], string>;
  height?: number;
  width?: number;
  style?: CSSProperties | undefined;
  options?: _DeepPartialObject<
    | (CoreChartOptions<"line"> &
        ElementChartOptions<"line"> &
        PluginChartOptions<"line"> &
        DatasetChartOptions<"line"> &
        ScaleChartOptions<"line"> &
        LineControllerChartOptions)
    | undefined
  >;
  description?: string;
};

export const LineChart: FC<Props> = ({
  data,
  width,
  height,
  style,
  options,
  description,
}) => {
  return (
    <>
      <Line
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
      <span className="hidden">{description}</span>
    </>
  );
};
