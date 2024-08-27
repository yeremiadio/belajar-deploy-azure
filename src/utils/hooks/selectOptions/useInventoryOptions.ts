import { useGetInventoryQuery } from '@/stores/managementStore/inventoryStore';
import { IInventory } from '@/types/api/management/inventory';

const useInventoryOptions = () => {
  const { data: inventory } = useGetInventoryQuery({
    isPaginated: false,
  });

  const data = inventory?.entities
    ? inventory.entities.map((value: IInventory) => {
        return {
          label: `${value?.uniqueId} - ${value.name}`,
          value: value.id,
          ...value,
        };
      })
    : [];

  return { data };
};

export default useInventoryOptions;
