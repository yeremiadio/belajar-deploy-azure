export type TMapDescriptionProps<T> = {
  center: {
    lat: number;
    lng: number;
  };
  data?: T[];
  threshold_value?: number;
  getTooltipDescription: (item: T, threshold_value?: number) => string;
};