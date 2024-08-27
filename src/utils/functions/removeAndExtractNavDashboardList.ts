import { NavigationItem, NavigationList } from '@/types/sidebar';

type TRemoveExtractNavDashboardList = {
  updatedDashboardList: NavigationList;
  purchaseOrderNav?: NavigationItem;
  yardNav?: NavigationItem;
  employeeTrackerNav?: NavigationItem;
};

const excludeMenuFromDashboard = ['purchaseorder', 'yard', 'employeetracker'];

export const removeAndExtractNavDashboardList = (
  dashboardMenu: NavigationList,
): TRemoveExtractNavDashboardList => {
  let purchaseOrderNav: NavigationItem | undefined;
  let yardNav: NavigationItem | undefined;
  let employeeTrackerNav: NavigationItem | undefined;
  // let envirobox: NavigationItem | undefined;

  const updatedDashboardList =
    dashboardMenu.filter((menu) => {
      if (menu.screentype === excludeMenuFromDashboard[0]) {
        purchaseOrderNav = menu;
        return false;
      }

      if (menu.screentype === excludeMenuFromDashboard[1]) {
        yardNav = menu;
        return false;
      }

      if (menu.screentype === excludeMenuFromDashboard[2]) {
        employeeTrackerNav = menu;
        return false;
      }
      // example if you want to add another
      // if (menu.screentype === excludeMenuFromDashboard[1]) {
      //   envirobox = menu;
      //   return false;
      // }
      return true;
    }) ?? [];

  return {
    updatedDashboardList,
    purchaseOrderNav,
    yardNav,
    employeeTrackerNav,
  };
};
