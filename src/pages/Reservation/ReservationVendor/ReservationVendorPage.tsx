import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

import Copilot from '@/components/Copilot';
import TopBar from '@/components/TopBar';
import ContentWrapper from '@/components/Wrapper/ContentWrapper';
import PageWrapper from '@/components/Wrapper/PageWrapper';

import { setHtmlRefId } from '@/stores/htmlRefStore/htmlRefSlice';

import useAppDispatch from '@/utils/hooks/useAppDispatch';
import useElementDimensions from '@/utils/hooks/useElementDimension';

import DriverTable from './_components/Table/DriverTable';
import VehicleTable from './_components/Table/VehicleTable';
import VendorTable from './_components/Table/VendorTable';

export default function ReservationVendorPage() {
  const dispatch = useAppDispatch();
  const htmlId = 'reservationVendorManagementId';
  const topElementRef = useRef<HTMLDivElement>(null);
  const topElementDimension = useElementDimensions(topElementRef);
  const occupiedHeight = topElementDimension.height + 42;

  const [searchParams, setSearchParams] = useSearchParams();
  const viewParameter = searchParams.get('view');

  const handleClickViewParameter = (view: 'vendor' |'vehicle' | 'driver') => {
    searchParams.set('view', view);
    setSearchParams(searchParams);
  };

  useEffect(() => {
    dispatch(setHtmlRefId(htmlId));
    if (!viewParameter) {
      handleClickViewParameter('vendor');
    }
  }, [dispatch, viewParameter]);

  const TableReservation = () => {
    switch (viewParameter) {
      case 'vendor':
        return (
          <VendorTable
          viewParameter={viewParameter}
          handleClickViewParameter={(view) => {
            handleClickViewParameter(view)
            }
          }
          />
        );
      case 'vehicle':
        return (
          <VehicleTable
          viewParameter={viewParameter}
          handleClickViewParameter={(view) => handleClickViewParameter(view)}
          />
        );
      case 'driver':
        return (
          <DriverTable
          viewParameter={viewParameter}
          handleClickViewParameter={(view) => handleClickViewParameter(view)}
          />
        );
      default:
        return (
          <VendorTable
          viewParameter={viewParameter}
          handleClickViewParameter={(view) => handleClickViewParameter(view)}
          />
        );
    }
  };

  return (
    <PageWrapper>
      <TopBar
        title={viewParameter === 'driver'? "Management Driver" : viewParameter === 'vehicle'? "Management Vehicle" : "Management Vendor"}
        isFloating={false}
        topBarRef={topElementRef}
      />
      <ContentWrapper id={htmlId}>
        <div
          className="relative flex flex-col gap-4 p-1 w-full overflow-auto"
          style={{
            height: `calc(100vh - (${occupiedHeight}px)`,
          }}
        >
      {TableReservation()}          
        </div>
        <Copilot />
      </ContentWrapper>
    </PageWrapper>
  );
}
