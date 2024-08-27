import { useGetInventoryGroupsQuery } from '@/stores/managementStore/inventoryStore';

const useInventoryGroupOptions = () => {
  const { data: inventoryGroups } = useGetInventoryGroupsQuery({
    isPaginated: false,
  });

  const data = inventoryGroups?.entities
    ? inventoryGroups.entities.map((value) => {
        return {
          label: value.name,
          value: value.id,
          ...value,
        };
      })
    : [];

  return { data };
};

export default useInventoryGroupOptions;
