import { useGetModuleV2Query } from '@/stores/managementStore/moduleStore/modulesStoreApi';
import { IModule } from '@/types/api/module';
import { BasicSelectOpt } from '@/types/global';

import useGetNavigationList from '../useGetNavigationList';

interface IModuleOpt extends BasicSelectOpt<number>, IModule {}

interface ReturnVal {
  arr: IModuleOpt[];
  isLoading: boolean;
}

type Props = {
  filterByPermission?: boolean;
};

const useModuleOpts = ({ filterByPermission }: Props): ReturnVal => {
  const { data, isLoading: loading, isFetching } = useGetModuleV2Query();
  const { navigationList } = useGetNavigationList();
  const isLoading = loading || isFetching;

  if (!data || data.length < 1) {
    return {
      arr: [],
      isLoading,
    };
  }

  const arr = data.map((item) => ({
    label: item.name,
    value: item.id,
    ...item,
  }));

  if (filterByPermission) {
    const filteredModuleByPermission = arr?.filter((module) =>
      navigationList?.some((nav) =>
        module?.permissions?.dashboard?.some(
          (permission) => permission?.name === nav?.screentype,
        ),
      ),
    );

    return {
      arr: filteredModuleByPermission,
      isLoading,
    };
  }

  return {
    arr,
    isLoading,
  };
};

export default useModuleOpts;
