import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

import { setHtmlRefId } from '@/stores/htmlRefStore/htmlRefSlice';

import useAppDispatch from '@/utils/hooks/useAppDispatch';

import TopBar from '@/components/TopBar';
import ContentWrapper from '@/components/Wrapper/ContentWrapper';
import PageWrapper from '@/components/Wrapper/PageWrapper';
import Copilot from '@/components/Copilot';
import useElementDimensions from '@/utils/hooks/useElementDimension';

import ReservationTable from './_components/ReservationTable';

export default function ReservationPage() {
  const dispatch = useAppDispatch();
  const htmlId = 'reservationManagementId';

  const topElementRef = useRef<HTMLDivElement>(null);
  const topElementDimension = useElementDimensions(topElementRef);
  const occupiedHeight = topElementDimension.height + 42;

  const [searchParams, setSearchParams] = useSearchParams();
  const viewParameter = searchParams.get('view');

  const handleClickViewParameter = (view: 'active' | 'completed') => {
    searchParams.set('view', view);
    setSearchParams(searchParams);
  };

  useEffect(() => {
    dispatch(setHtmlRefId(htmlId));
    if (!viewParameter) {
      handleClickViewParameter('active');
    }
  }, [dispatch, viewParameter]);

  return (
    <PageWrapper>
      <TopBar
        title="Reservation Management"
        isFloating={false}
        topBarRef={topElementRef}
      />
      <ContentWrapper id={htmlId}>
        <div
          className="relative flex w-full flex-col gap-4 overflow-auto p-1"
          style={{
            height: `calc(100vh - (${occupiedHeight}px)`,
          }}
        >
          <ReservationTable
            handleClickViewParameter={handleClickViewParameter}
            viewParameter={viewParameter}
          />
        </div>

        <Copilot />
      </ContentWrapper>
    </PageWrapper>
  );
}
