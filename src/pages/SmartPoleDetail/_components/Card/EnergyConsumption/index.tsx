import { FC, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { DoughnutChart } from '@/components/Chart/DoughnutChart';

import { Card } from '@/pages/SmartPoleDetail/_components/Card';

import { useGetEnergyConsumptionDeviceSmartPoleQuery } from '@/stores/smartPoleStore/smartPoleStoreApi';
import { pieChartCanvasDesc } from '@/utils/functions/tuningCopilot/canvasDescription';
import useWindowDimensions from '@/utils/hooks/useWindowDimension';

interface Props {}

export const EnergyConsumption: FC<Props> = () => {
  const { id: smart_pole_id } = useParams<'id'>();
  const { gatewayId } = useParams<'gatewayId'>();

  const { width } = useWindowDimensions();

  const {
    data: energyConsumptionList,
    isLoading,
    isFetching,
  } = useGetEnergyConsumptionDeviceSmartPoleQuery(
    {
      id: smart_pole_id ? Number(smart_pole_id) : undefined,
      gatewayId: gatewayId ? Number(gatewayId) : undefined,
    },
    {
      skip: !smart_pole_id || !gatewayId,
    },
  );
  const loading = isLoading || isFetching;

  const dataMemo = useMemo(() => {
    if (!energyConsumptionList || energyConsumptionList.length === 0) return [];

    const data = energyConsumptionList.slice();
    return data;
  }, [energyConsumptionList]);

  const max_value = 100;
  const percent = dataMemo?.length ? dataMemo[0].value : 0;

  const dataChart = {
    labels: ['Electricity'],
    datasets: [
      {
        label: dataMemo?.length ? dataMemo[0].label : '',
        data: [percent, max_value - percent],
        backgroundColor: ['#00E39E', '#354358'],
        cutout: '80%',
        borderWidth: 0,
        rotation: 90,
        circumference: 360,
      },
    ],
  };

  return (
    <Card border={true} title="Energy Consumption">
      {!loading ? (
        <div className="relative box-border flex h-full w-full items-center justify-center overflow-hidden">
          {/* content */}
          <DoughnutChart
            data={dataChart}
            description={pieChartCanvasDesc(dataChart)}
            options={{
              elements: {
                arc: {
                  borderRadius: 10,
                },
              },
              plugins: {
                title: {
                  display: false,
                },
                legend: {
                  display: true,
                  position: 'bottom',
                  align: 'center',
                  labels: {
                    font: {
                      family: 'Plus Jakarta Sans',
                      size:
                        width >= 1440 && width < 1620
                          ? 14
                          : width >= 1620 && width < 1920
                            ? 18
                            : width >= 1920
                              ? 24
                              : 12,
                    },
                    boxHeight: 4,
                    boxWidth: 4,
                    pointStyle: 'circle',
                    usePointStyle: true,
                  },
                },
                datalabels: {
                  display: false,
                },
                tooltip: {
                  enabled: false,
                },
              },
            }}
          />
          <span className="absolute left-1/2 top-[42%] z-50 -translate-x-1/2 -translate-y-1/2 text-xl font-bold xl:text-6xl">
            {percent}%
          </span>
        </div>
      ) : (
        <></>
      )}
    </Card>
  );
};
