import dayjs from 'dayjs';
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import {
  Calendar,
  dayjsLocalizer,
  Messages,
  Views,
  ViewsProps,
} from 'react-big-calendar';
import { FaCheck } from 'react-icons/fa6';
import { PopoverClose } from '@radix-ui/react-popover';
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';

import { ProductionIcon } from '@/assets/images/ProductIcon';
import { TriangleWarningIcon } from '@/assets/images/TriangleWarningIcon';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useGetWorkOrderQuery } from '@/stores/inventoryStore/workOrderStore/workOrderStoreApi';
import { IWorkOrderResponse } from '@/types/api/inventory/workOrder';
import { IEvent } from '@/types/calendar';
import { ROUTES } from '@/utils/configs/route';
import { colorEventCalendar } from '@/utils/functions/colorEventCalendar';
import useAppDispatch from '@/utils/hooks/useAppDispatch';

import CalendarToolbar from './_components/Toolbar';
import YearView from './_components/YearView';
import { toggleModalView } from '@/stores/inventoryStore/inventorySlice';

export type TWorkOrderEvent = IEvent &
  Partial<Pick<IWorkOrderResponse, 'recipeDetails'>>;

const CalendarProductionPlanning = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const handleModalIsViewInventory = () => {
    dispatch(toggleModalView());
  };
  const [popOverPos, setPopoverPos] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [showMoreEvents, setShowMoreEvents] = useState<{
    events: TWorkOrderEvent[];
    date: Date;
  }>({ events: [], date: new Date() });
  const [isShowDrilldownView, setIsShowDrilldownView] =
    useState<boolean>(false);
  const [currentViewState, setCurrentViewState] = useState<string>('month');
  // Get the first date of the current month
  const firstDateOfMonth = dayjs().startOf('month').toISOString();
  // Get the last date of the current month
  const lastDateOfMonth = dayjs().endOf('month').toISOString();

  // Get the last date of the current month
  const [searchParams, setSearchParams] = useSearchParams();
  const startDateRangeEvent = searchParams.get('startDate');
  const searchInputParams = searchParams.get('search');
  const typePlanParams = searchParams.get('type');
  const endDateRangeEvent = searchParams.get('endDate');

  const {
    data: workOrderData,
    isLoading: isLoadingWorkOrderData,
    isFetching: isFetchingWorkOrderData,
    refetch,
  } = useGetWorkOrderQuery(
    {
      isPaginated: false,
      search: searchInputParams ?? undefined,
      isActual: typePlanParams
        ? typePlanParams === 'actual'
          ? true
          : false
        : undefined,
      startDateAt: startDateRangeEvent as string,
      endDateAt: endDateRangeEvent as string,
    },
    { skip: !startDateRangeEvent || !endDateRangeEvent },
  );

  const loadingWorkOrderData =
    isLoadingWorkOrderData || isFetchingWorkOrderData;

  const sanitizedWorkOrderDataMemo = useMemo<TWorkOrderEvent[]>(() => {
    if (
      !workOrderData ||
      !workOrderData.entities ||
      loadingWorkOrderData ||
      !typePlanParams
    )
      return [];
    let data = [...workOrderData.entities];
    const sanitizedData = data.map((item, index) => {
      const currentDate = dayjs();
      const startDateEvent = new Date(
        typePlanParams === 'actual' ? item.startActual : item.startPlan,
      );
      const status = item.status;
      const countEndRunning = item.targetrunning + item.downtime;
      const endUtcDate = new Date(
        typePlanParams === 'actual' ? item.endActual : item.endPlan,
      );
      /**
       * @description startActual + Planned Time + Down Time
       */
      const endTemporaryRunningDate = dayjs(item.startActual)
        .add(countEndRunning, 'hour')
        .toDate();
      const diffTemporaryEndDateAndToday = currentDate.diff(
        endTemporaryRunningDate,
        'days',
      );
      const isCalculatedEndDateMoreThanToday =
        diffTemporaryEndDateAndToday >= 0;
      const isRunningActualButEndDateEmpty =
        status === 'running' && typePlanParams === 'actual' && !item.endActual;
      const endDateEvent = isRunningActualButEndDateEmpty
        ? isCalculatedEndDateMoreThanToday
          ? currentDate.toDate()
          : endTemporaryRunningDate
        : endUtcDate;
      return {
        id: index,
        productId: item.id.toString(),
        qty: item.targetoutput,
        title: item.name,
        inventoryName: item.inventory?.name ?? '',
        machineName: item.machine.name ?? '',
        status: item.status ?? '',
        start: startDateEvent
          ? new Date(
              startDateEvent.getFullYear(),
              startDateEvent.getMonth(),
              startDateEvent.getDate(),
              startDateEvent.getUTCHours(),
              startDateEvent.getMinutes(),
              0,
            )
          : '',
        end: endDateEvent
          ? new Date(
              endDateEvent.getFullYear(),
              endDateEvent.getMonth(),
              endDateEvent.getDate(),
              endDateEvent.getUTCHours(),
              endDateEvent.getMinutes(),
              0,
            )
          : '',
        recipeDetails: item.recipeDetails,
      };
    });
    return sanitizedData;
  }, [workOrderData, typePlanParams]);

  const { defaultDate, scrollToTime } = useMemo(
    () => ({
      defaultDate: new Date(),
      scrollToTime: new Date(1970, 1, 1, 6),
    }),
    [],
  );

  useEffect(() => {
    if (!startDateRangeEvent && !endDateRangeEvent) {
      searchParams.set('startDate', firstDateOfMonth);
      searchParams.set('endDate', lastDateOfMonth);
      setSearchParams(searchParams);
    }
  }, [startDateRangeEvent, endDateRangeEvent]);

  useEffect(() => {
    if (!typePlanParams) {
      searchParams.set('type', 'actual');
      setSearchParams(searchParams);
    }
  }, [typePlanParams]);

  const DayEvent = ({ event }: { event: TWorkOrderEvent }) => {
    const isSomeRecipeIsEmpty = event.recipeDetails?.recipeIngredients.some(
      (incredient) => !incredient.isReady,
    );
    const isActual = typePlanParams && typePlanParams === 'actual';
    const isComplete = event.status === 'complete' && !isActual;
    return (
      <Popover>
        <PopoverTrigger className="flex h-full w-full items-center px-2">
          <p className={cn('flex-1 text-center', isComplete && 'line-through')}>
            {event.inventoryName
              ? `${event.title} - ${event.inventoryName}`
              : event.title}
          </p>
          {isSomeRecipeIsEmpty ? (
            <TriangleWarningIcon color="#FC5A5A" className="ml-auto" />
          ) : null}
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="min-w-[600px] rounded-xl border-rs-v2-thunder-blue bg-rs-v2-navy-blue p-[24px]"
        >
          <div className="flex items-center">
            <div
              style={colorEventCalendar(event, 'icon')}
              className="mr-2 h-4 w-4 rounded"
            />
            <div className="text-lg font-bold">
              {event.inventoryName
                ? `${event.title} - ${event.inventoryName}`
                : event.title}
            </div>
          </div>
          <p className="flex items-center text-base text-rs-neutral-chromium">
            Machine: {event.machineName}
          </p>
          <p className="mb-8 flex items-center text-base text-rs-neutral-chromium">
            {event.start && dayjs(event.start).format('DD MMMM YYYY')} -{' '}
            {event.end && dayjs(event.end).format('DD MMMM YYYY')}
          </p>
          <div className="mb-2 flex items-center text-sm">
            {' '}
            <ProductionIcon className="mr-2" /> Target Production: {event.qty}
          </div>

          {event.recipeDetails?.recipeIngredients &&
          event.recipeDetails?.recipeIngredients.length > 0 ? (
            event.recipeDetails?.recipeIngredients?.map((value, index) => (
              <div
                key={index}
                className="mb-4 grid grid-flow-row-dense grid-cols-3 items-center rounded-lg border border-rs-v2-gunmetal-blue bg-rs-v2-galaxy-blue"
              >
                <div className="flex h-full items-center justify-start border-r border-r-rs-v2-gunmetal-blue px-4 py-3 text-left">
                  {value.inventory.name ?? '-'}
                </div>
                <div className="flex h-full items-center justify-center border-r border-r-rs-v2-gunmetal-blue px-4 py-3 text-center">
                  {value.totalAmount ?? '-'} {''}
                  {value.inventory.unit ?? '-'}
                </div>
                <div className="flex  h-full items-center justify-center border-r border-r-rs-v2-gunmetal-blue px-4 py-3 text-center">
                  <div
                    className={cn(
                      !!value?.isReady
                        ? 'rounded-[50px] bg-rs-alert-green-30% px-3 py-1 text-sm text-rs-alert-green'
                        : 'flex items-center rounded-[50px] bg-rs-v2-red-60% px-3 py-1 text-xs text-rs-v2-red',
                    )}
                  >
                    {!!value?.isReady ? (
                      <div className="flex items-center">
                        <div className="mr-0.5">Stock Ready</div> <FaCheck />
                      </div>
                    ) : (
                      <>
                        Stock Not Enough <TriangleWarningIcon />
                      </>
                    )}
                  </div>
                </div>
                {/* <div className="col-span-3 flex h-full items-center justify-center px-4 py-3 text-center">
                  <Button
                    className="btn-mint-green hover:hover-btn-mint-greeen !opacity-100 disabled:bg-rs-v2-grey-disable"
                    disabled
                  >
                    Purchase
                  </Button>
                </div> */}
              </div>
            ))
          ) : (
            <div className="text-rs-neutral-chromium">
              There are no product material stocks.
            </div>
          )}
          <div className="mt-10 flex justify-end gap-2">
            <PopoverClose asChild>
              <Button className="btn-terinary-gray hover:hover-btn-terinary-gray">
                Close
              </Button>
            </PopoverClose>
            <Button
              onClick={() => {
                if (event.title) {
                  navigate({
                    pathname: ROUTES.inventoryWorkOrder,
                    search: createSearchParams({
                      search: event.title,
                    }).toString(),
                  });
                  handleModalIsViewInventory();
                }
              }}
              className="btn-secondary-navy-blue-60 hover:hover-btn-secondary-navy-blue-60 disabled:btn-secondary-navy-blue-60"
            >
              See Detail
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    );
  };

  const eventStyle = (event: IEvent) => {
    return {
      style: colorEventCalendar(event, 'badge'),
    };
  };

  const onHandleSelect = (event: IEvent) => {
    const startDateString = dayjs(event.start);
    const endDateString = dayjs(event.end);
    const diffDays = endDateString.diff(startDateString, 'days');

    const eventDataToStore = {
      qty: event.qty,
      title: event.title,
      start: startDateString,
      end: endDateString,
      duration: diffDays,
    };

    localStorage.setItem('dayEventData', JSON.stringify(eventDataToStore));
  };

  const calendarViews = useMemo<ViewsProps<IEvent, object>>(() => {
    return {
      month: true,
      day: false,
      week: true,
      year: YearView,
    };
  }, [YearView]);

  const handleRangeChange = useCallback(
    (
      range:
        | Date[]
        | {
            start: Date;
            end: Date;
          },
    ) => {
      if (currentViewState === 'month') {
        const rangeDate = range as { start: Date; end: Date };
        searchParams.set('startDate', dayjs(rangeDate.start).toISOString());
        searchParams.set('endDate', dayjs(rangeDate.end).toISOString());
        setSearchParams(searchParams);
      } else if (currentViewState === 'year') {
        const rangeDate = range as Date[];
        const firstMonth = rangeDate[0];
        const lastMonth = rangeDate[rangeDate.length - 1];
        searchParams.set('startDate', firstMonth.toISOString());
        searchParams.set('endDate', lastMonth.toISOString());
        setSearchParams(searchParams);
      }
    },
    [searchParams, currentViewState],
  );

  return (
    <>
      <Popover
        open={isShowDrilldownView}
        onOpenChange={(open) => setIsShowDrilldownView(open)}
        modal
      >
        <PopoverContent
          align="start"
          className={cn(
            'absolute max-h-80 overflow-y-auto rounded-lg border-rs-v2-thunder-blue bg-rs-v2-navy-blue',
          )}
          style={{
            top: popOverPos.y - 130,
            left: popOverPos.x + 30,
          }}
        >
          <p>{dayjs(showMoreEvents.date).format('DD/MM/YYYY')}</p>
          <div className="flex max-h-28 flex-col gap-2">
            {showMoreEvents.events.map((event) => {
              const { style } = eventStyle(event);
              return (
                <div key={event.title} style={style} className="rounded-full">
                  <DayEvent key={event.title} event={event} />
                </div>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
      <Calendar
        className="w-full"
        localizer={dayjsLocalizer(dayjs)}
        events={sanitizedWorkOrderDataMemo}
        popup={false}
        defaultView={Views.MONTH}
        scrollToTime={scrollToTime}
        defaultDate={defaultDate}
        onView={(view) => {
          setCurrentViewState(view.toString());
          refetch();
        }}
        onShowMore={(events, date) => {
          setShowMoreEvents({ events, date });
        }}
        onRangeChange={(range) => handleRangeChange(range)}
        onSelectEvent={onHandleSelect}
        eventPropGetter={(event) => eventStyle(event)}
        components={{
          event: DayEvent,
          toolbar: CalendarToolbar,
        }}
        views={calendarViews}
        doShowMoreDrillDown={false}
        messages={
          {
            year: 'Year',
            showMore: (total) =>
              (
                <div
                  style={{ cursor: 'pointer' }}
                  onMouseOver={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                  onClick={(e) => {
                    setPopoverPos({ y: e.clientY, x: e.clientX });
                    setIsShowDrilldownView(!isShowDrilldownView);
                  }}
                >
                  {`+${total} more`}
                </div>
              ) as ReactNode,
          } as Messages
        }
      />
    </>
  );
};
export default CalendarProductionPlanning;
