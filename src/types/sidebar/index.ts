import { IconType } from 'react-icons';
import { KnownUsertype } from '@/types/api/user';

export type NavigationList = NavigationItem[];

export type NavigationItem = ParentItem & {
  icon: IconType | string;
  screentype?: string;
  kiddos?: KiddoItem[];
};

type ParentItem = {
  name: string;
  url: string;
  userType?: KnownUsertype[];
  screentype?: string;
  allowedUrl?: string[];
  disabled?: boolean;
};

export type KiddoItem = ParentItem & {
  iconShrink?: IconType | string;
};
