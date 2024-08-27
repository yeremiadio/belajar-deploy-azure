import {
  LineChartData,
  PieChartData,
  DoughnutChartData,
} from '@/types/tuningCopilot/canvasDescription';

export const lineChartCanvasDesc = (
  data: LineChartData,
  labelName: string,
  titleChart: string,
) => {
  const labelValuePairs = data?.labels?.map(
    (label, index) =>
      `${label?.toLowerCase ? label.toLowerCase() : label}:${data.datasets[0].data[index]}`,
  );
  const valuesString = labelValuePairs?.join(', ');
  const color = data.datasets[0].borderColor;

  return `The ${titleChart} chart represents the values for the ${labelName} of ${valuesString}. The ${titleChart} line color is ${color}.`;
};

export const pieChartCanvasDesc = (data: PieChartData) => {
  const dataLabels = data.labels.join(', ');
  const percentagesWithColors = data.datasets[0].data
    .map(
      (percentage, index) =>
        `${data.labels[index]}: ${percentage}% (${data.datasets[0].backgroundColor[index]})`,
    )
    .join(', ');

  return `The chart represents data for ${dataLabels}. The percentages with colors are as follows: ${percentagesWithColors}.`;
};

export const doughnutChartCanvasDesc = (
  data: DoughnutChartData,
  titleChart: string,
) => {
  const segments = data.datasets[0].data.map((percent, index) => ({
    percent,
    color: data.datasets[0].backgroundColor[index].toUpperCase(),
  }));

  const segmentsDescription = segments
    .map((segment, index) => {
      return `Segment ${index + 1}: ${segment.percent}%, Color: ${
        segment.color
      }`;
    })
    .join(', ');

  return `The ${titleChart} chart consists of ${segments.length} segments. ${segmentsDescription}. The chart has a cutout of ${data.datasets[0].cutout} in the center, a circumference of ${data.datasets[0].circumference}, and is rotated by ${data.datasets[0].rotation} degrees.`;
};
