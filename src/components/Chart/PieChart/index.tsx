import { CSSProperties, FC } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ChartData,
  CoreChartOptions,
  ElementChartOptions,
  PluginChartOptions,
  DatasetChartOptions,
  ScaleChartOptions,
  PieControllerChartOptions,
  ArcElement,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { _DeepPartialObject } from "node_modules/chart.js/dist/types/utils";

ChartJS.register(ChartDataLabels, ArcElement, Title, Tooltip, Legend);

ChartJS.defaults.font.family = "Plus Jakarta Sans";
ChartJS.defaults.color = "#fff";
ChartJS.defaults.font.size = 9;

type Props = {
  data: ChartData<"pie", number[], string>;
  height?: number;
  width?: number;
  style?: CSSProperties | undefined;
  options?: _DeepPartialObject<
    | (CoreChartOptions<"pie"> &
        ElementChartOptions<"pie"> &
        PluginChartOptions<"pie"> &
        DatasetChartOptions<"pie"> &
        ScaleChartOptions<"pie"> &
        PieControllerChartOptions)
    | undefined
  >;
  description?: string;
};

export const PieChart: FC<Props> = ({
  data,
  width,
  height,
  style,
  options,
  description,
}) => {
  return (
    <>
      <Pie
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
