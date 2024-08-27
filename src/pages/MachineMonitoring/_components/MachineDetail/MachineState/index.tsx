import { FC } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  ChartData,
  ChartOptions,
  Plugin
} from 'chart.js';
import Card from '@/components/Card';
import { TMachineStateTime } from '@/types/api/machineMonitoring';

Chart.register(CategoryScale, LinearScale, BarElement);

interface FloatingBarData {
  x: [number, number];
  y: string;
  backgroundColor?: string;
}

type Props = {
  dataMachineState: TMachineStateTime[];
};

const MachineStateChart: FC<Props> = ({dataMachineState}) => {
  const convertTimeData = (data: TMachineStateTime[]): FloatingBarData[] => {
    return data.map(item => ({
      x: item.startTime && item.endTime ? [timeToNumber(item.startTime), timeToNumber(item.endTime)] : [0, 0],
      y: item.status,
      backgroundColor: item.color || '#000000'
    }));
  };
  
  const timeToNumber = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours + minutes / 60;
  };

  const labelsMapping = [...new Set(dataMachineState.map(item => item.status))];

  const data: ChartData<'bar', FloatingBarData[]> = {
    labels: labelsMapping,
    datasets: [
      {
        label: 'Floating Bar Chart',
        data: convertTimeData(dataMachineState),
        borderColor: 'transparent', 
        borderWidth: 1,
        barThickness: 0,
        categoryPercentage: 0.1,
        barPercentage: 0.1,
        backgroundColor: 'rgba(0, 0, 0, 0)'
      }
    ]
  };
  
  const options: ChartOptions<'bar'> = {
    indexAxis: 'y',
    elements: {
      bar: {
        borderWidth: 2,
        borderRadius: 3
      }
    },
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 60
      }
    },
    plugins: {
      legend: {
        display: false 
      },
      tooltip: {
        enabled: false 
      },
      datalabels: {
        display: false 
      }
    },
    scales: {
      x: {
        type: 'linear' as const,
        position: 'bottom' as const,
        min: 0,
        max: 24,
        ticks: {
          stepSize: 1,
          callback: function(value: string | number) {
            if (typeof value === 'number') {
              const hours = Math.floor(value);
              const minutes = Math.round((value - hours) * 60);
              return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
            }
            return value;
          }
        }
      },
       y: {
      type: 'category' as const,
      position: 'left' as const,
      labels:  labelsMapping, 
      ticks: {
        display: false,
      }
    }
    }
  };
  
  const beforeDatasetsDrawPlugin: Plugin<'bar'> = {
    id: 'customBarPlugin',
    beforeDatasetsDraw(chart: Chart<'bar'>) {
      const { ctx, data, scales } = chart;
      const xScale = scales.x;
      const yScale = scales.y;
  
      if (!xScale || !yScale) {
        console.error('Scales not found or incorrect type');
        return;
      }
  
      data.datasets.forEach((dataset) => {
        if (Array.isArray(dataset.data)) {
          const datasetData = dataset.data as unknown as FloatingBarData[];
  
          datasetData.forEach((dataPoint) => {
            if (dataPoint && Array.isArray(dataPoint.x) && dataPoint.x.length === 2) {
              const [xStart, xEnd] = dataPoint.x;
              const yLabel = dataPoint.y;
              const color = dataPoint.backgroundColor || '#000000';
  
              const yIndex = yScale.getPixelForValue(yLabel as any);
  
              const xStartPixel = xScale.getPixelForValue(xStart);
              const xEndPixel = xScale.getPixelForValue(xEnd);
  
              ctx.save();
              ctx.beginPath();
              ctx.fillStyle = color as string;
              ctx.fillRect(xStartPixel, yIndex - customBarHeight / 2, xEndPixel - xStartPixel, customBarHeight);
              ctx.restore();
            }
          });
        }
      });
    }
  };
  
  const customBarHeight = 30;
  
  const changeLabelColorsPlugin: Plugin<'bar'> = {
    id: 'changeLabelColorsPlugin',
    beforeDraw(chart) {
      const { ctx, scales, config } = chart;
      const yScale = scales.y;
      const xScale = scales.x;
  
      if (!yScale || !xScale) {
        console.error('Scales not found');
        return;
      }
  
      const dataset = config.data.datasets[0];
      if (!dataset || !Array.isArray(dataset.data)) {
        console.error('Dataset not found or incorrect type');
        return;
      }
  
      const data = dataset.data as unknown as FloatingBarData[];
      const yLabels = yScale.ticks.map(tick => typeof tick.label === 'string' ? tick.label : '');
  
      yLabels.forEach((label, index) => {
        const dataPoint = data.find(d => d.y === label);
        if (dataPoint) {
          ctx.save();
          ctx.fillStyle = dataPoint.backgroundColor || '#000000';
          const yPos = yScale.getPixelForTick(index);
          const xPos = xScale.left - 10;
          ctx.textAlign = 'right';
          ctx.fillText(label, xPos, yPos + 5);
          ctx.restore();
        }
      });
    }
  };
  return (
    <Card className="flex flex-col gap-4 p-5 w-full">
      <h1 className="h-fit text-start text-xl">
        Machine State
      </h1>
      <div className="box-border mt-5 w-full h-full overflow-x-auto chart-container">
        <Bar data={data} options={options} plugins={[beforeDatasetsDrawPlugin, changeLabelColorsPlugin]} />
      </div>
    </Card>
  );
};

export default MachineStateChart;
