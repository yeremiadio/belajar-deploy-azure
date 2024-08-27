import { FC, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import useAppDispatch from '@/utils/hooks/useAppDispatch';

import TopBar from '@/components/TopBar';
import ContentWrapper from '@/components/Wrapper/ContentWrapper';
import PageWrapper from '@/components/Wrapper/PageWrapper';
import Copilot from '@/components/Copilot';

import { setHtmlRefId } from '@/stores/htmlRefStore/htmlRefSlice';
import {
  updateReservationQueryData,
  useGetReservationAllQuery,
} from '@/stores/reservationStore/reservationStoreApi';

import useElementDimensions from '@/utils/hooks/useElementDimension';
import { useWebSocketYard } from '@/utils/hooks/useWebSocketYard';

import WaitingPlace from './_components/WaitingPlace';
import DockingPlace from './_components/DockingPlace';

const UnitracePage: FC = () => {
  const dispatch = useAppDispatch();

  const topBarRef = useRef<HTMLDivElement>(null);
  const topBarDimension = useElementDimensions(topBarRef);
  const occupiedHeight = topBarDimension.height + 42;

  const { gatewayId } = useParams<'gatewayId'>();
  const htmlId = 'unitraceId';

  useEffect(() => {
    dispatch(setHtmlRefId(htmlId));
  }, [dispatch]);

  const { data: reservationData, refetch } = useGetReservationAllQuery(
    {
      gatewayId: Number(gatewayId),
    },
    {
      skip: !gatewayId,
    },
  );

  const { yardSocket } = useWebSocketYard({
    gatewayId: Number(gatewayId),
  });

  useEffect(() => {
    if (!yardSocket || !gatewayId) return;

    dispatch(
      updateReservationQueryData(
        'getReservationAll',
        { gatewayId: Number(gatewayId) },
        (ret) => {
          ret.forEach((dev, idx, arr) => {
            if (dev.id === yardSocket.id) {
              Object.assign(arr[idx], yardSocket);
            }
          });
        },
      ),
    );
    refetch();
  }, [yardSocket, gatewayId, refetch]);

  return (
    <PageWrapper>
      <TopBar title="Unitrace - Yard" topBarRef={topBarRef} />
      <OverlayScrollbarsComponent
        className="h-full w-full"
        options={{ scrollbars: { autoHide: 'scroll', theme: 'os-theme-rs' } }}
        defer
      >
        <ContentWrapper
          style={{
            maxHeight: `calc(100vh - ${occupiedHeight}px)`,
          }}
        >
          <OverlayScrollbarsComponent
            className="h-full w-full min-w-[1024px]"
            options={{
              scrollbars: { autoHide: 'scroll', theme: 'os-theme-rs' },
            }}
            defer
          >
            <WaitingPlace reservationData={reservationData ?? []} />
            <DockingPlace reservationData={reservationData ?? []} />
          </OverlayScrollbarsComponent>
          <Copilot className="sticky right-0 top-0 2xl:relative" />
        </ContentWrapper>
      </OverlayScrollbarsComponent>
    </PageWrapper>
  );
};

export default UnitracePage;
