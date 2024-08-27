export const getColorChartByThreshold = (threatlevel: number) => {
  const _threatlevel = threatlevel.toString();
  switch (_threatlevel) {
    case '2':
      return '#FC5A5A';
    case '1':
      return '#FDAA09';
    default:
      return '#77C3BE';
  }
};
