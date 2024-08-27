import { loadCookie } from '@/services/cookie';

import { TPermission } from '@/types/cookie';
import { NavigationList, NavigationItem } from '@/types/sidebar';

import { managementNavigation } from '@/utils/configs/navigation';
import useUserType from './auth/useUserType';

export const useManagementPermission = () => {
  const permissions = loadCookie('permissions');
  const currentUserType = useUserType();
  if (!permissions) return [];
  const managementNavigationWithPermission = (
    JSON.parse(permissions).management as Array<TPermission>
  )
    .filter((item) => item.permission === true)
    .map((item) => item.name
    )

 const filteredNavigationWithPermission = managementNavigation.reduce((acc: NavigationList, item: NavigationItem) => {
    if (item.kiddos) {
        const filteredKiddos = item.kiddos.filter(kiddo => {
            return kiddo.screentype && (managementNavigationWithPermission.includes(kiddo.screentype));
        });
        const AdminFilteredKiddos = item.kiddos.filter(kiddo => {
          return kiddo.screentype;
      });
        if(currentUserType !== "systemadmin"){
          if (filteredKiddos.length > 0) {
            const newItem = { ...item, kiddos: filteredKiddos };
            acc.push(newItem);
        }
        } else {
          const newItem = { ...item, kiddos: AdminFilteredKiddos };
          acc.push(newItem);
        }
       
      }
    return acc;
  }, []);
  console.log(filteredNavigationWithPermission)
  return managementNavigation
};

