import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

import Copilot from '@/components/Copilot';
import Spinner from '@/components/Spinner';
import TopBar from '@/components/TopBar';
import ContentWrapper from '@/components/Wrapper/ContentWrapper';
import PageWrapper from '@/components/Wrapper/PageWrapper';

import { setHtmlRefId } from '@/stores/htmlRefStore/htmlRefSlice';
import { updateMachineMonitoringQueryData, useGetmachineMonitoringListQuery } from '@/stores/machineMonitoringStore';

import useElementDimensions from '@/utils/hooks/useElementDimension';
import { useWebSocketGateway } from '@/utils/hooks/useWebSocketGateway';

import MachineCardList from './_components/MachineCardList';
import useAppDispatch from '@/utils/hooks/useAppDispatch';

const MachineMonitoringPage = () => {
  const htmlId = 'machineMonitoringId';
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setHtmlRefId(htmlId));
  }, [dispatch]);

  const topBarRef = useRef<HTMLDivElement>(null);
  const topBarDimension = useElementDimensions(topBarRef);
  const occupiedHeight = topBarDimension.height + 42;
  const { gatewayId } = useParams<'gatewayId'>();

  const { data, isLoading } = useGetmachineMonitoringListQuery({
    gatewayId: Number(gatewayId),
  });

  // websocket
  const { gatewayDevice } = useWebSocketGateway({
    gatewayId: Number(gatewayId),
  });

  // re-assign value websocket to redux
  useEffect(() => {
    if (!gatewayDevice || !gatewayId) return;

    dispatch(
      updateMachineMonitoringQueryData(
        'getmachineMonitoringList',
        { gatewayId: Number(gatewayId) },
        (ret) => {
          ret.forEach((dev, idx, arr) => {
            if (dev.id === gatewayDevice.id) {
              Object.assign(arr[idx], gatewayDevice);
            }
          });
        },
      ),
    );
  }, [gatewayDevice, gatewayId]);

  return (
    <PageWrapper>
      <TopBar title="Machine Monitoring" topBarRef={topBarRef} />
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
          {isLoading ? (
            <Spinner
              isFullWidthAndHeight={false}
              containerClassName="h-[calc(100vh-105px)]"
            />
          ) : (
            <div
              id={htmlId}
              className="flex lg:flex-row flex-col flex-grow gap-7 lg:gap-0 lg:h-full overflow-auto lg:overflow-hidden"
            >
              <MachineCardList devices={data ?? []} />
            </div>
          )}
        </OverlayScrollbarsComponent>
        <Copilot />
      </ContentWrapper>
    </PageWrapper>
  );
};

export default MachineMonitoringPage;
