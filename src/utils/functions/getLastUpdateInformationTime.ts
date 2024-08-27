import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

export const getLastUpdateInformationTime = (date: string) => {
  if (!date) return 'last updated -';
  dayjs.extend(duration);
  const timeDifference = dayjs().diff(dayjs(date));
  const durationObject = dayjs.duration(timeDifference);
  if (durationObject.asSeconds() < 60) {
    return `last updated ${Math.floor(durationObject.asSeconds())} second(s) ago`;
  } else if (durationObject.asMinutes() < 60) {
    return `last updated ${Math.floor(durationObject.asMinutes())} minute(s) ago`;
  } else if (durationObject.asHours() < 24) {
    return `last updated ${Math.floor(durationObject.asHours())} hour(s) ago`;
  } else if (durationObject.asDays() < 7) {
    return `last updated ${Math.floor(durationObject.asDays())} day(s) ago`;
  } else if (durationObject.asWeeks() < 5) {
    return `last updated ${Math.floor(durationObject.asWeeks())} week(s) ago`;
  } else if (durationObject.asMonths() < 12) {
    return `last updated ${Math.floor(durationObject.asMonths())} month(s) ago`;
  } else {
    const years = Math.floor(durationObject.asYears());
    const months = Math.floor(durationObject.asMonths() % 12);
    return `last updated ${years} year(s) and ${months} month(s) ago`;
  }
};
