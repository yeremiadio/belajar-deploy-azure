import { ROUTES } from '../configs/route';

export const getDefaultRouteByRoleUser = (role?: string) => {
  switch (role) {
    case 'fieldoperator':
      return ROUTES.mobileReservation;
    default:
      return ROUTES.dashboard;
  }
};

export const getDefaultRouteByUserTypeName = (usertypeName?: string) => {
  switch (usertypeName) {
    case 'fieldoperator':
      return ROUTES.mobileReservation;
    default:
      return ROUTES.dashboard;
  }
};
