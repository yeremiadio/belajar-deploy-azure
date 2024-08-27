import { TSensorLogSummary, TSummaryObj } from '@/types/api/sensorlogSummaries';

import getDateFormatListString from './getDateFormatListString';

interface IFilteredWhiskerDataObject {
  startDate: string;
  summary: TSummaryObj;
}

export type TDateFilterType = 'DAY' | 'WEEK' | 'MONTH';

export interface ISensorlogSummaryWhiskerChartOptions {
  type: TDateFilterType;
}

export const filteredWhiskerDataObjects = (
  data: TSensorLogSummary[],
  sensorCode: string,
): IFilteredWhiskerDataObject[] => {
  const filteredData: IFilteredWhiskerDataObject[] = [];

  data.forEach((item) => {
    const summaryItem = item.summary.find(
      (summary) => summary.sensorcode === sensorCode,
    );
    if (summaryItem) {
      filteredData.push({ startDate: item.startDate, summary: summaryItem });
    }
  });

  return filteredData;
};

const convertWhiskerDataToNumber = (summary: TSummaryObj): number[] => {
  return [
    parseFloat(summary.q1.toFixed(2)),
    parseFloat(summary.q3.toFixed(2)),
    parseFloat(summary.avg),
    parseFloat(summary.max),
    parseFloat(summary.min),
  ];
};

/**
 *
 * @description This Function is to generate a ready-use
 * whisker box-plot chart
 * @todo refactor if the type format is "DAY" that generate 00:00 until 24:00
 * @returns
 */
export const whiskerData = (
  filteredWhiskerData: IFilteredWhiskerDataObject[],
  { type }: ISensorlogSummaryWhiskerChartOptions,
): {
  label: string[];
  data: number[][];
} => {
  let labels: string[] = [];
  const data: number[][] = [[], [], [], [], []];

  const appendFlattenValues = (
    dateIndexNumber: number,
    summary: TSummaryObj,
  ) => {
    const summaryValues = convertWhiskerDataToNumber(summary);
    const flattenedValues = summaryValues.flatMap((value) => value);
    flattenedValues.forEach((value) => {
      data[dateIndexNumber]?.push(value);
    });
  };

  switch (type) {
    case 'DAY':
      labels = getDateFormatListString({
        locales: 'en',
        format: 'short',
        type: 'DAY',
      });
      filteredWhiskerData.forEach((item) => {
        const startDate = new Date(item.startDate);
        const dayOfWeek = startDate.getUTCDay();
        appendFlattenValues(dayOfWeek, item.summary);
      });
      break;
    case 'WEEK':
      labels = getDateFormatListString({
        locales: 'en',
        format: 'short',
        type: 'WEEK',
      });
      // console.log({ t: getDateArrayListString({ locales: 'en', format: 'short', type: 'WEEK' }), d: labels })
      filteredWhiskerData.forEach((item) => {
        const startDate = new Date(item.startDate);
        const dayOfWeek = startDate.getUTCDay();
        appendFlattenValues(dayOfWeek, item.summary);
      });
      break;
    case 'MONTH':
      labels = getDateFormatListString({
        locales: 'en',
        format: 'short',
        type: 'MONTH',
      });
      filteredWhiskerData.forEach((item) => {
        const startDate = new Date(item.startDate);
        const monthinYear = startDate.getMonth();
        appendFlattenValues(monthinYear, item.summary);
      });
      break;
    default:
      break;
  }
  return { label: labels, data };
};
