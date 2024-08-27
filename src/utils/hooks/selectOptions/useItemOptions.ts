import { useGetItemsQuery } from '@/stores/itemStore/itemStoreApi';
// import { Meta, TBackendPaginationRequestObject } from '@/types/api';
// import { TItem } from '@/types/api/reservation';
// import { BasicSelectOpt } from '@/types/global';

// type Props = Partial<TItem>;

// interface ReturnVal {
//   isLoading: boolean;
//   arr: BasicSelectOpt<number>[];
//   meta?: Meta;
// }

// const useItemOptions = (
//   { page = 1, take = 10 }: TBackendPaginationRequestObject<Props>,
//   opt?: { skip?: boolean },
// ): ReturnVal => {
//   const { data, isLoading } = useGetItemsQuery(
//     { page, take },
//     { skip: opt?.skip },
//   );
//   if (!data || data.entities.length < 1) return { arr: [], isLoading };

//   return {
//     arr: data.entities.map((val) => {
//       return {
//         label: val.id + ' - ' + val.name,
//         value: val.id,
//         ...val,
//       };
//     }),
//     isLoading,
//     meta: data.meta,
//   };
// };

// TODO: Inventory will replace Item
const useItemOptions = () => {
  const { data: items, isLoading } = useGetItemsQuery({
    page: 1,
    take: 10,
  });

  const data = items?.entities
    ? items.entities.map((value) => {
        return {
          label: `${value.id}`,
          value: value.id,
          ...value,
        };
      })
    : [];

  return { arr: data, isLoading };
};

export default useItemOptions;
