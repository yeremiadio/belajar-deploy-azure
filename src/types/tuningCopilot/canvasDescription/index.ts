import { ScriptableContext } from 'chart.js';

export type LineChartData = {
  labels: string[] | undefined;
  datasets: {
    label?: string;
    data: number[];
    borderColor?: string;
    pointRadius?: number;
    color?: string;
    fill?: boolean;
    backgroundColor?: string | ((context: ScriptableContext<"line">) => CanvasGradient);
    fillColor?: string;
  }[];
};

export type PieChartData = {
  labels: string[];
  datasets: {
    data: number[];
    backgroundColor: string[];
  }[];
};

export type DoughnutChartData = {
  datasets: {
    data: number[];
    backgroundColor: string[];
    cutout: string;
    circumference: number;
    rotation: number;
  }[];
};
