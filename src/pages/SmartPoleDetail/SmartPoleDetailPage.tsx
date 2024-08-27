import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import Copilot from '@/components/Copilot';
import TopBar from '@/components/TopBar';
import ContentWrapper from '@/components/Wrapper/ContentWrapper';
import PageWrapper from '@/components/Wrapper/PageWrapper';
import { cn } from '@/lib/utils';
import { setHtmlRefId } from '@/stores/htmlRefStore/htmlRefSlice';
import { TBreadcrumbItem } from '@/types/topbar';
import { ROUTES } from '@/utils/configs/route';
import useWindowDimensions from '@/utils/hooks/useWindowDimension';

import { AirQualityIndex } from './_components/Card/AirQualityIndex';
import { Cctv } from './_components/Card/Cctv';
import { EnergyConsumption } from './_components/Card/EnergyConsumption';
import { SmartPoleInformation } from './_components/Card/SmartPoleInformation';
import { SprayedWaterVolume } from './_components/Card/SprayedWaterVolume';
import { WaterSprayingHistory } from './_components/Card/WaterSprayingHistory';

export default function SmartPoleDetailPage() {
  const topBarRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const [heightTopBar, setHeightTopBar] = useState<number>(0);
  const htmlId = 'smartPoleDetailId';

  useEffect(() => {
    dispatch(setHtmlRefId(htmlId));
  }, [dispatch]);

  useLayoutEffect(() => {
    if (topBarRef.current) {
      setHeightTopBar(topBarRef.current.getBoundingClientRect().height);
    }
  }, [topBarRef]);

  const { id: smart_pole_id } = useParams<'id'>();
  const { gatewayId } = useParams<'gatewayId'>();

  const [breadcrumb] = useState<TBreadcrumbItem[]>([
    {
      label: 'Smart Pole',
      path: gatewayId ? ROUTES.smartPoleGateway(gatewayId) : ROUTES.smartPole,
    },
    {
      label: 'Detail Smart Pole',
      path: gatewayId
        ? ROUTES.smartPoleGatewayDetail(gatewayId, smart_pole_id as string)
        : ROUTES.smartPoleDetail(smart_pole_id as string),
    },
  ]);

  const { width } = useWindowDimensions();

  return (
    <PageWrapper>
      <TopBar
        title="Detail Smart Pole"
        topBarRef={topBarRef}
        breadcrumb={breadcrumb}
      />
      <ContentWrapper>
        <div
          id={htmlId}
          className={cn(
            `content box-border grid w-full grid-cols-1 grid-rows-6 gap-6 md:grid-cols-2 md:grid-rows-3 lg:grid-cols-3 lg:grid-rows-2`,
          )}
          style={{
            height:
              width <= 1024
                ? 'fit-content'
                : `calc(100vh - (${heightTopBar}px + 35px))`,
          }}
        >
          <SmartPoleInformation />
          <Cctv />
          <SprayedWaterVolume />
          <EnergyConsumption />
          <WaterSprayingHistory />
          <AirQualityIndex />
        </div>
        <Copilot />
      </ContentWrapper>
    </PageWrapper>
  );
}
