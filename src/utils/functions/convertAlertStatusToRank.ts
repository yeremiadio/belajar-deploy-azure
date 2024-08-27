import { EStatusAlertEnum } from '@/types/api/socket';

export const convertAlertStatusToRank = (status: EStatusAlertEnum): number => {
  switch (status) {
    case EStatusAlertEnum.CRITICAL:
      return 1;
    case EStatusAlertEnum.WARNING:
      return 2;
    case EStatusAlertEnum.NORMAL:
      return 3;
  }
};
