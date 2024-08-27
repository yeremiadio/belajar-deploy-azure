import { IModule } from '@/types/api/module';
import { IDashboardPermission } from '@/types/api/permission';

export const useGetPermissionLabelName = (modules: IModule[]) => {
  const dashboardPermissions = {} as { [key in keyof IDashboardPermission]: string };

  modules.forEach(module => {
    const dashboard = module.permissions.dashboard.map((item) => item.name) as string[];

    dashboard.forEach(dash => {
      dashboardPermissions[dash] = dash.charAt(0).toUpperCase() + dash.slice(1);
      ;
    });
  });

  return dashboardPermissions;
};