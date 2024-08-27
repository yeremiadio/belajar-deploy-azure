import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

import Copilot from '@/components/Copilot';
import TopBar from '@/components/TopBar';
import ContentWrapper from '@/components/Wrapper/ContentWrapper';
import PageWrapper from '@/components/Wrapper/PageWrapper';
import { cn } from '@/lib/utils';
import { setHtmlRefId } from '@/stores/htmlRefStore/htmlRefSlice';
import useAppDispatch from '@/utils/hooks/useAppDispatch';
import useWindowDimensions from '@/utils/hooks/useWindowDimension';

import { DeviceList } from './_components/Card/DeviceList';
import { Summary } from './_components/Card/Summary';
import ValueTrendBoxPlot from './_components/Card/ValueTrendBoxPlot';

export default function EnergyMeterPage() {
  const htmlId = 'energyMeterId';
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(setHtmlRefId(htmlId));
  }, [dispatch]);

  const topBarRef = useRef<HTMLDivElement>(null);
  const [heightTopBar, setHeightTopBar] = useState<number>(0);

  const { pathname } = useLocation();

  useLayoutEffect(() => {
    if (topBarRef.current) {
      setHeightTopBar(topBarRef.current.getBoundingClientRect().height);
    }
  }, [topBarRef]);

  const { width } = useWindowDimensions();

  return (
    <PageWrapper>
      <TopBar
        title="Energy Meter"
        topBarRef={topBarRef}
        additionalTitle={pathname.includes('advanced') ? 'Advanced' : 'Basic'}
        additionalTitleColor={
          pathname.includes('advanced') ? 'text-rs-sun-yellow' : 'text-white'
        }
      />
      <ContentWrapper>
        <div
          id={htmlId}
          className={cn(
            `content box-border grid w-full grid-cols-1 grid-rows-3 gap-6 md:grid-cols-3 md:grid-rows-2`,
          )}
          style={{
            height:
              width <= 1024
                ? 'fit-content'
                : `calc(100vh - (${heightTopBar}px + 42px))`,
          }}
        >
          <Summary />
          <ValueTrendBoxPlot />
          <DeviceList />
        </div>
        <Copilot />
      </ContentWrapper>
    </PageWrapper>
  );
}
