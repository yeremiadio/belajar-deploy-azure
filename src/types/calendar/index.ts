import { Nullable } from "@/types/global";
export interface IEvent {
  id?: number;
  title: Nullable<string>;
  start: string | Date;
  end: string | Date;
  desc?: string;
  allDay?: boolean;
  bgColor?: string;
  productId?: string;
  qty?: number;
  machineName: string;
  inventoryName?: string;
  /**
   * @example "closed" | "start"
   */
  status: string;
}
