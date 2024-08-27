export const getColorByCo2Threshold = (co2Threshold: number) => {
  if (co2Threshold >= 0 && co2Threshold <= 300) {
    return "#00E39E";
  } else if (co2Threshold > 300 && co2Threshold <= 400) {
    return "#FDAA09";
  } else {
    return "#FC5A5A";
  }
};
