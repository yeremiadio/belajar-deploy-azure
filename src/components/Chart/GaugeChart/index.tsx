import { CSSProperties, FC } from "react";
import { Doughnut } from "react-chartjs-2";
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
  DoughnutControllerChartOptions,
  ArcElement,
} from "chart.js";

import ChartDataLabels from "chartjs-plugin-datalabels";
import { _DeepPartialObject } from "node_modules/chart.js/dist/types/utils";

ChartJS.register(ChartDataLabels, ArcElement, Title, Tooltip, Legend);

ChartJS.defaults.font.family = "Plus Jakarta Sans";
ChartJS.defaults.color = "#fff";
ChartJS.defaults.font.size = 9;

type Props = {
  data: ChartData<"doughnut", number[], string>;
  height?: number;
  width?: number;
  style?: CSSProperties | undefined;
  options?: _DeepPartialObject<
    | (CoreChartOptions<"doughnut"> &
        ElementChartOptions<"doughnut"> &
        PluginChartOptions<"doughnut"> &
        DatasetChartOptions<"doughnut"> &
        ScaleChartOptions<"doughnut"> &
        DoughnutControllerChartOptions)
    | undefined
  >;
  className?: string;
  percent: number;
  description?: string;
};

export const GaugeChart: FC<Props> = ({
  data,
  width,
  height,
  style,
  options,
  className,
  percent,
  description,
}) => {
  return (
    <div className="relative h-fit w-full px-8">
      <Doughnut
        className={className}
        data={data}
        width={width}
        height={height}
        style={style}
        options={{
          ...options,
          responsive: true,
          maintainAspectRatio: true,
          color: "#fff",
          font: {
            family: "Plus Jakarta Sans",
            size: 9,
          },
        }}
      />
      <span className="hidden">{description}</span>
      <p className="absolute bottom-5 left-4 text-sm xl:text-base">0</p>
      <p className="absolute left-1/2 top-0 -translate-x-1/2 text-sm xl:text-base">50</p>
      <p className="absolute bottom-5 right-1 text-sm xl:text-base">100</p>
      <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 flex-col items-center xl:gap-y-1">
        <p className="text-2xl font-bold xl:text-4xl">{percent}</p>
        <p className="text-xs font-semibold xl:text-sm">%rh</p>
      </div>
    </div>
  );
};
