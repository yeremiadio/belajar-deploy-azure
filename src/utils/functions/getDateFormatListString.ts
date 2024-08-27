type TDateArrayListParameters = {
  locales?: string | string[];
  format: 'long' | 'short' | 'narrow';
  type: 'DAY' | 'WEEK' | 'MONTH';
};
const getDateFormatListString = ({
  locales = 'en',
  format,
  type,
}: TDateArrayListParameters): string[] => {
  const year = new Date().getFullYear();
  let list: number[] = [];
  switch (type) {
    case 'DAY':
      const today = new Date();
      const dayFormatter = new Intl.DateTimeFormat(locales, {
        weekday: 'long',
      });
      const todayDay = dayFormatter.format(today);
      return [todayDay];
    case 'WEEK':
      list = [...Array(7).keys()];
      const formatter = new Intl.DateTimeFormat(locales, {
        weekday: format,
      });
      const getWeekName = (index: number) =>
        formatter.format(new Date(Date.UTC(2021, 1, index + 1)));
      list.map(getWeekName);
      const resultWeek = list.map(getWeekName);
      return resultWeek;
    case 'MONTH':
      list = [...Array(12).keys()];
      const monthFormatter = new Intl.DateTimeFormat(locales, {
        month: format,
      });
      const getMonthName = (index: number) =>
        monthFormatter.format(new Date(year, index));
      const resultMonth = list.map(getMonthName);
      return resultMonth;
    default:
      return [];
  }
};

export default getDateFormatListString;
