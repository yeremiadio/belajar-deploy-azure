import { BasicSelectOpt } from "@/types/global";

export const createOptions = (parameters: string[]):BasicSelectOpt<string>[]  => {
    return parameters.map(param => ({ label: param, value: param }));
  }