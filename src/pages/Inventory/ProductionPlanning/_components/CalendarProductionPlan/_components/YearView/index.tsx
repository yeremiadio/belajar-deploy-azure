import dayjs from 'dayjs';
import { isEmpty } from 'lodash';
import { useState } from 'react';
import { DateLocalizer, Navigate, ViewProps } from 'react-big-calendar';
import { MdOutlineClose } from 'react-icons/md';

import { Button, buttonVariants } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent } from '@/components/ui/popover';

import { cn } from '@/lib/utils';
import { TWorkOrderEvent } from '@/pages/Inventory/ProductionPlanning/_components/CalendarProductionPlan';

import { colorEventCalendar } from '@/utils/functions/colorEventCalendar';
import { useOutsideClick } from '@/utils/hooks/useClickOutside';

const YearView = ({
  date,
  localizer,
  events,
}: Omit<ViewProps, 'events'> & { events: TWorkOrderEvent[] }) => {
  const currentDate = typeof date === 'string' ? new Date(date) : date;
  const currRange = YearView.range(currentDate, { localizer });
  const [selectedEvent, setSelectedEvent] = useState<TWorkOrderEvent[] | null>(
    null,
  );
  const selectedDays = events
    ?.filter((event) => event.start)
    .map((event) => new Date(event.start!));
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });

  const popupRef = useOutsideClick(() => {
    setPopoverVisible(false);
    setPopoverPosition({ top: 0, left: 0 });
  });

  //set any
  const handleDayClick = (day: Date, _: any, e: any) => {
    setPopoverPosition({ top: e.clientY, left: e.clientX });
    if (selectedDay && dayjs(selectedDay).isSame(day, 'day')) {
      setSelectedDay(null);
      setPopoverVisible(false);
    } else {
      const clickedDayEvents = events?.filter((event) =>
        dayjs(event.start).isSame(day, 'day'),
      );

      if (clickedDayEvents && clickedDayEvents.length > 0) {
        setSelectedEvent(clickedDayEvents);
        setSelectedDay(day);
      } else {
        setSelectedEvent([]);
        setSelectedDay(day);
      }
      setPopoverVisible(true);
    }
  };

  return (
    <div className="mx-[-10px] mt-[-10px] grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <Popover open={popoverVisible} onOpenChange={setPopoverVisible}>
        <PopoverContent
          ref={popupRef}
          align="center"
          className={cn(
            'PopoverContent absolute min-w-[296px] rounded-xl border-rs-v2-thunder-blue bg-rs-v2-navy-blue p-[24px]',
          )}
          style={{
            top: popoverPosition.top - 15,
            left: popoverPosition.left - 320,
          }}
        >
          <Button
            className="absolute right-0 top-0 text-white hover:bg-transparent hover:opacity-75 focus:bg-transparent"
            variant="ghost"
            onClick={() => {
              setPopoverVisible(false);
            }}
          >
            <MdOutlineClose />
          </Button>
          <div className="text-center ">
            <div className="text-xl text-rs-neutral-steel-gray">
              {selectedDay && dayjs(selectedDay).format('ddd')}
            </div>
            <div className="mb-8 text-xl">
              {selectedDay && dayjs(selectedDay).format('DD')}
            </div>
            {!isEmpty(selectedEvent) ? (
              selectedEvent?.map((event, index) => (
                <div
                  key={index}
                  style={colorEventCalendar(event, 'badge')}
                  className="mb-4 flex items-center justify-center rounded-[50px] px-3 py-1 text-sm"
                >
                  <div className="mr-6 flex items-center">
                    <p className="flex-1 text-center">
                      {event.inventoryName
                        ? `${event.title} - ${event.inventoryName}`
                        : event.title}
                    </p>
                  </div>

                  {/* <TriangleWarningIcon className="h-4 w-4" /> */}
                </div>
              ))
            ) : (
              <div className="text-rs-neutral-chromium">
                There are no events scheduled on this day.
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {currRange.map((month, index) => {
        return (
          <div className="w-full" key={index}>
            <Calendar
              numberOfMonths={1}
              month={month}
              selected={selectedDays}
              className="h-full"
              classNames={{
                months: 'h-full',
                month:
                  'space-y-4 !rounded-lg border border-rs-v2-thunder-blue py-[22px] px-[20px] !h-full',
                caption: 'flex justify-left pt-1 relative items-center',
                table: 'w-full border-collapse space-y-1',
                head_row: 'flex',
                head_cell:
                  'text-muted-foreground !rounded-md w-9 font-normal text-[0.8rem] w-full',
                row: 'flex w-full mt-2',
                cell: '!w-full h-9 w-9 text-center !rounded-full text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
                day_range_end: 'day-range-end',
                day: cn(
                  buttonVariants({ variant: 'ghost' }),
                  'h-9 w-9 rounded-full p-0 font-normal aria-selected:opacity-100',
                ),
                day_selected:
                  'bg-rs-neural-20% border-white text-white border rounded-full hover:bg-rs-v2-mint hover:border-rs-v2-mint focus:border-rs-v2-mint hover:text-rs-v2-black-text-button focus:bg-rs-v2-mint hover:bg-rs-v2-mint focus:text-rs-v2-black-text-button',
                day_today:
                  'bg-rs-v2-mint rounded-full border-rs-v2-mint !text-rs-v2-black-text-button hover:bg-rs-v2-mint hover:border-rs-v2-mint focus:border-rs-v2-mint hover:text-rs-v2-black-text-button focus:bg-rs-v2-mint hover:bg-rs-v2-mint focus:text-rs-v2-black-text-button',
                day_outside:
                  'day-outside !rounded-full text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30',
                day_disabled: 'text-muted-foreground opacity-50',
                day_range_middle:
                  'aria-selected:bg-accent !rounded-full text-red aria-selected:text-accent-foreground',
                day_hidden: 'invisible',
              }}
              modifiers={{
                eventDay: (date: Date) =>
                  events?.some((event) =>
                    dayjs(event.start).isSame(dayjs(date), 'day'),
                  ) || false,
              }}
              onDayClick={handleDayClick}
            />
          </div>
        );
      })}
    </div>
  );
};

export default YearView;

YearView.range = (date: Date, { localizer }: { localizer: DateLocalizer }) => {
  const start = localizer.startOf(date, 'year');
  const end = localizer.endOf(date, 'year');

  const range = [];
  let current = start;

  while (localizer.lte(current, end, 'year')) {
    range.push(current);
    current = localizer.add(current, 1, 'month');
  }

  return range;
};

YearView.navigate = (
  date: Date,
  //set any
  action: any,
  { localizer }: { localizer: DateLocalizer },
) => {
  if (action instanceof Date) return action;

  switch (action) {
    case Navigate.NEXT:
      return localizer.add(date, 1, 'year');
    case Navigate.PREVIOUS:
      return localizer.add(date, -1, 'year');
    default:
      return date;
  }
};

YearView.title = (date: Date, { localizer }: { localizer: DateLocalizer }) => {
  return localizer.format(date, 'YYYY');
};
