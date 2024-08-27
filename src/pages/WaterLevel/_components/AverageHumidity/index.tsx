import { FC, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { DoughnutChart } from '@/components/Chart/DoughnutChart';
import { Card } from '@/pages/WaterLevel/_components/Card';
import { useGetAverageHumadityQuery } from '@/stores/waterLevelStore/waterLevelStoreApi';
import { doughnutChartCanvasDesc } from '@/utils/functions/tuningCopilot/canvasDescription';

interface Props {}

export const AverageHumidity: FC<Props> = () => {
  const { gatewayId } = useParams<'gatewayId'>();
  const {
    data: averageHumadity,
    isLoading,
    isFetching,
  } = useGetAverageHumadityQuery({
    gatewayId: gatewayId ? Number(gatewayId) : undefined,
  });
  const loading = isLoading || isFetching;

  const dataMemo = useMemo(() => {
    if (!averageHumadity) return 0;

    const data = averageHumadity;
    return data;
  }, [averageHumadity]);

  const percent = dataMemo;
  const max_value = 100;

  const dataChart = {
    datasets: [
      {
        label: '',
        data: [percent, max_value - percent],
        backgroundColor: ['#00E39E', 'rgba(0, 227, 158, 0.2)'],
        cutout: '80%',
        borderWidth: 0,
        rotation: 220,
        circumference: 280,
      },
    ],
  };

  return (
    <Card border={true} title="Average Humidity" className="h-fit">
      {!loading ? (
        <div className="relative box-border flex h-full w-full items-center justify-center overflow-hidden p-6">
          <DoughnutChart
            data={dataChart}
            description={doughnutChartCanvasDesc(dataChart, 'average humidity')}
            options={{
              elements: {
                arc: {
                  borderRadius: 10,
                },
              },
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
          />
          <p className="absolute left-1/2 top-0 -translate-x-1/2 text-base">
            50
          </p>
          <div className="absolute left-1/2 top-[56%] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center xl:gap-y-1">
            <p className="text-5xl font-bold">{percent}</p>
            <p className="font-normal xl:text-base">%rh</p>
            <div className="relative w-8">
              <p className="absolute -bottom-10 -left-24 text-base">0</p>
              <p className="absolute -bottom-10 -right-28 text-base">100</p>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </Card>
  );
};
