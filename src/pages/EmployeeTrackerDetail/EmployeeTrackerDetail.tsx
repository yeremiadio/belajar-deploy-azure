import { useRef } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';

import { TBreadcrumbItem } from '@/types/topbar';

import Breadcrumb from '@/components/Breadcrumb';
import Copilot from '@/components/Copilot';
import TopBar from '@/components/TopBar';
import ContentWrapper from '@/components/Wrapper/ContentWrapper';
import PageWrapper from '@/components/Wrapper/PageWrapper';
import { cn } from '@/lib/utils';
import { RootState } from '@/stores';
import { useGetEmpActivityQuery } from '@/stores/employeeTrackerStore/employeeTrackerStoreApi';
import { ROUTES } from '@/utils/configs/route';
import useElementDimension from '@/utils/hooks/useElementDimension';
import useWindowDimensions from '@/utils/hooks/useWindowDimension';

import ActivityLog from './_components/ActivityLog';
import AvailabilityToday from './_components/AvailabilityToday';
import AvailabilityTrend from './_components/AvailabilityTrend';
import CurrentLocation from './_components/CurrentLocation';
import EmployeeIdentity from './_components/EmployeeIdentity';
import EmployeeProfile from './_components/EmployeeProfile';

const EmployeeTrackerDetail = () => {
  const htmlId = 'employeeTrackerDetailId';
  const [searchParams, _] = useSearchParams();
  const id = searchParams.get('id');

  const { isCopilotOpen } = useSelector(
    ({ toggleCopilotSlice }: RootState) => toggleCopilotSlice,
  );

  const { gatewayId } = useParams<'gatewayId'>();

  const { data: employeeData } = useGetEmpActivityQuery({
    id: id ?? '1',
    gatewayId: gatewayId ? Number(gatewayId) : undefined,
  });
  const { width } = useWindowDimensions();

  const topElementRef = useRef<HTMLDivElement>(null);
  const topElementDimension = useElementDimension(topElementRef);
  const occupiedHeight = topElementDimension.height + 42;

  const breadcrumbItems: TBreadcrumbItem[] = [
    {
      label: 'Employee Tracker',
      path: gatewayId
        ? ROUTES.employeeTrackerGateway(gatewayId)
        : ROUTES.employeeTracker,
      clickable: true,
    },
    {
      label: 'Employee Detail',
      path: gatewayId
        ? ROUTES.employeeTrackerGatewayDetail(gatewayId, id as string)
        : ROUTES.employeeTrackerDetail,
      clickable: false,
    },
  ];

  return (
    <PageWrapper className="overflow-clip">
      <div ref={topElementRef}>
        <TopBar title="Detail Employee"></TopBar>
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <ContentWrapper id={htmlId} className="mt-4">
        <div
          className="flex w-full overflow-y-scroll"
          style={{
            height: `calc(100vh - (${occupiedHeight}px)`,
          }}
        >
          <div
            className={cn(
              `box-border grid w-full grid-cols-1 grid-rows-6 gap-4 md:h-fit md:grid-cols-2 md:grid-rows-3 xl:grid-cols-[300px_1fr_1fr] xl:grid-rows-2`,
              isCopilotOpen
                ? 'md:grid-cols-1 md:grid-rows-6 xl:h-fit xl:grid-cols-2 xl:grid-rows-3 2xl:grid-cols-3 2xl:grid-rows-2'
                : '',
            )}
            style={{
              height:
                width <= 1280
                  ? 'fit-content'
                  : isCopilotOpen
                    ? 'fit-content'
                    : `calc(100vh - (${occupiedHeight}px)`,
            }}
          >
            <div className="">
              <EmployeeProfile data={employeeData} />
            </div>
            <div className="">
              <EmployeeIdentity data={employeeData} />
            </div>
            <div className="">
              <ActivityLog id={id} />
            </div>
            <div
              className={cn(
                'order-5 xl:order-4',
                isCopilotOpen ? 'xl:order-5 2xl:order-4 ' : '',
              )}
            >
              <AvailabilityToday id={id} />
            </div>
            <div
              className={cn(
                'order-6 w-full xl:order-5',
                isCopilotOpen ? 'xl:order-6 2xl:order-5' : '',
              )}
            >
              <AvailabilityTrend id={id} />
            </div>
            <div
              className={cn(
                'order-4  xl:order-6',
                isCopilotOpen ? 'xl:order-4 2xl:order-6' : '',
              )}
            >
              <CurrentLocation id={id} />
            </div>
          </div>
        </div>
        <Copilot />
      </ContentWrapper>
    </PageWrapper>
  );
};

export default EmployeeTrackerDetail;
