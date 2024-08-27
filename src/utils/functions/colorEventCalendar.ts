
import { COLORS } from '@/assets/colors';
import { TWorkOrderEvent } from '@/pages/Inventory/ProductionPlanning/_components/CalendarProductionPlan';
import addAlphatoHexColor from './addAlphaToHexColor';

export const colorEventCalendar = (event: TWorkOrderEvent, type: string) => {
  let bgColor;
  let borderColor;

  const id = event.id ?? 0

  const colors = [
    COLORS.darkOrange,
    COLORS.darkGreen,
    COLORS.darkPurple,
    COLORS.calendarBlue,
    COLORS.calendarCyan,
    COLORS.calendarDarkGreen,
    COLORS.calendarPink,
    COLORS.calendarPurple,
    COLORS.calendarRed,
    COLORS.calendarYellow,
  ];

  borderColor = colors[id % colors.length] ?? '#8BC34A' // Ready color
  bgColor = addAlphatoHexColor(colors[id % colors.length], 0.3) ?? '#7AFC5A4D';

  return type === 'badge'
    ? {
      backgroundColor: bgColor,
      color: 'white',
      border: `1px solid ${borderColor}`,
    }
    : {
      backgroundColor: borderColor,
    };
};