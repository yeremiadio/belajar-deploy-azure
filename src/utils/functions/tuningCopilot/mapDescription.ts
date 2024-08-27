import { TMapDescriptionProps } from "@/types/tuningCopilot/mapDescription";

export const generateMapDescription = <T extends { lattitude: string; longtitude: string }>({
  center,
  data,
  threshold_value,
  getTooltipDescription,
}: TMapDescriptionProps<T>) => {
  const mapCenterDescription = `The center of the map information is Latitude: ${center.lat}, Longitude: ${center.lng}.`;

  const markersDescription = data
    ?.map((item) => {
      const markerPosition = `Lat: ${parseFloat(item.lattitude)}, Long: ${parseFloat(item.longtitude)}`;
      const tooltipDescription = getTooltipDescription(item, threshold_value);

      return `${markerPosition}${tooltipDescription}`;
    })
    .join('\n');

  return `${mapCenterDescription}\n${markersDescription}`;
};