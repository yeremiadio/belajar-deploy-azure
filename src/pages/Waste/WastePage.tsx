import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import { useEffect, useRef } from 'react';

import Copilot from '@/components/Copilot';
import TopBar from '@/components/TopBar';
import ContentWrapper from '@/components/Wrapper/ContentWrapper';
import PageWrapper from '@/components/Wrapper/PageWrapper';

import { setHtmlRefId } from '@/stores/htmlRefStore/htmlRefSlice';

import useElementDimensions from '@/utils/hooks/useElementDimension';
import useAppDispatch from '@/utils/hooks/useAppDispatch';

import WasteCardList from './_components/WasteCardList';

const WastePage = () => {
  const htmlId = 'wasteId';
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setHtmlRefId(htmlId));
  }, [dispatch]);

  const topBarRef = useRef<HTMLDivElement>(null);
  const topBarDimension = useElementDimensions(topBarRef);
  const occupiedHeight = topBarDimension.height + 42;

  return (
    <PageWrapper>
      <TopBar title="Waste Monitoring" topBarRef={topBarRef} />
      <ContentWrapper
        className="overflow-hidden"
        style={{
          maxHeight: `calc(100vh - ${occupiedHeight}px)`,
        }}
      >
        <OverlayScrollbarsComponent
          className="w-full h-full"
          options={{ scrollbars: { autoHide: 'scroll', theme: 'os-theme-rs' } }}
          defer
        >
          <div
            id={htmlId}
            className="flex lg:flex-row flex-col flex-grow gap-7 lg:gap-0 lg:h-full overflow-auto lg:overflow-hidden"
          >
            <WasteCardList />
          </div>
        </OverlayScrollbarsComponent>
        <Copilot />
      </ContentWrapper>
    </PageWrapper>
  );
};

export default WastePage;
