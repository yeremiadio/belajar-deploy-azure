import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import Copilot from '@/components/Copilot';
import TopBar from '@/components/TopBar';
import ContentWrapper from '@/components/Wrapper/ContentWrapper';
import PageWrapper from '@/components/Wrapper/PageWrapper';

import { setHtmlRefId } from '@/stores/htmlRefStore/htmlRefSlice';
import { useGetWaterlevelDeviceStatisticQuery } from '@/stores/waterLevelStore/waterLevelStoreApi';

import { TBreadcrumbItem } from '@/types/topbar';

import { ROUTES } from '@/utils/configs/route';
import useAppDispatch from '@/utils/hooks/useAppDispatch';
import useElementDimensions from '@/utils/hooks/useElementDimension';

import AlertHistory from './_components/AlertHistory';
import ChartCard from './_components/ChartCard';
import CurrentStatusCard from './_components/CurrentStatus';
import InformationWaterLevelCard from './_components/InformationCard';
import WaterLevelMapCard from './_components/Map/WaterLevelMapCard';

const WaterLevelDetail = () => {
  const { id: deviceId } = useParams<'id'>();
  const { gatewayId: gatewayId } = useParams<'gatewayId'>();
  const { data: detailData } = useGetWaterlevelDeviceStatisticQuery({
    gatewayId: Number(gatewayId),
  });

  const selectedWaterLevelData = useMemo(() => {
    if (!detailData) return;

    return detailData.find(
      (item) => Number(item.device_summary.id) === Number(deviceId),
    );
  }, [detailData, deviceId]);

  const htmlId = 'smartPoleDetailId';
  const dispatch = useAppDispatch();
  const topBarRef = useRef<HTMLDivElement>(null);
  const topBarDimension = useElementDimensions(topBarRef);
  const occupiedHeight = topBarDimension.height + 42;
  const [breadcrumb] = useState<TBreadcrumbItem[]>([
    {
      label: 'Water Level',
      path: gatewayId ? ROUTES.waterLevelGateway(gatewayId) : ROUTES.smartPole,
      clickable: true,
    },
    {
      label: 'Detail Water Level',
      path: gatewayId
        ? ROUTES.waterLevelGatewayDetail(gatewayId, deviceId as string)
        : ROUTES.waterLevelDetail(deviceId as string),
    },
  ]);

  useEffect(() => {
    dispatch(setHtmlRefId(htmlId));
  }, [dispatch]);

  return (
    <PageWrapper>
      <TopBar
        title="Water Level"
        breadcrumb={breadcrumb}
        topBarRef={topBarRef}
      />
      <ContentWrapper
        className="overflow-auto"
        style={{
          maxHeight: `calc(100vh - ${occupiedHeight}px)`,
        }}
      >
        <div className="grid flex-1 grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <InformationWaterLevelCard data={selectedWaterLevelData} />
          </div>
          <div>
            <CurrentStatusCard data={selectedWaterLevelData} />
          </div>
          <div className="min-h-[280px]">
            <WaterLevelMapCard data={selectedWaterLevelData} />
          </div>
          {/* Bottom */}
          <div className="col-span-1 max-h-[425px] min-h-[280px] lg:col-span-2">
            <ChartCard
              deviceData={selectedWaterLevelData}
              gatewayId={gatewayId}
            />
          </div>
          <div className="max-h-[425px] min-h-[280px]">
            <AlertHistory data={selectedWaterLevelData} />
          </div>
        </div>
        <Copilot className="absolute right-5 md:static" />
      </ContentWrapper>
    </PageWrapper>
  );
};

export default WaterLevelDetail;
