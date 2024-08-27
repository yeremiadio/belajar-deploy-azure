import { ReactNode } from "react";

export interface BasicSelectOpt<T = string> {
  label: ReactNode | string;
  value: T;
}
export type Nullable<D> = D | null | undefined;