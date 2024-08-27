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
import { cn } from "@/lib/utils";

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

export const CircularGaugeChart: FC<Props> = ({
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
    <div className="relative w-full h-full">
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
      <div className="top-1/2 left-1/2 absolute flex flex-col justify-center items-center transform -translate-x-1/2 -translate-y-1/2">
        <div    className={cn(
        'font-bold text-2xl lg:text-3xl xl:text-4xl ',
          className
      )}>{percent}%</div>
      
      </div>
    </div>
  );
};
