import {
  useGetTagByIdQuery,
  useGetTagQuery,
} from '@/stores/managementStore/tagStore/tagStoreApi';
import { Meta } from '@/types/api';
import { ITagObjResponse } from '@/types/api/management/tag';
import { BasicSelectOpt } from '@/types/global';

interface ReturnVal {
  isLoading: boolean;
  arr: BasicSelectOpt<number>[];
  meta?: Meta;
}

const useTagOptions = (opt?: {
  skip?: boolean;
  isAvailable?: boolean;
  // To bypass current tag id from isAvailable filter
  excludedId?: number;
}): ReturnVal => {
  const { data: excludedTag, isLoading: loadingExcludedTag } =
    useGetTagByIdQuery(
      {
        id: opt?.excludedId ?? 0,
      },
      { skip: !opt?.excludedId },
    );

  const { data, isLoading } = useGetTagQuery(
    {
      isPaginated: false,
      isAvailable: opt?.isAvailable,
    },
    { skip: opt?.skip },
  );
  if (!data || data.entities.length < 1 || loadingExcludedTag)
    return { arr: [], isLoading };

  const listTag = data.entities.map((val: ITagObjResponse) => {
    return {
      label: val.name ?? '',
      value: val.id,
    };
  });

  const arr = excludedTag
    ? listTag.concat({
        label: excludedTag.name ?? '',
        value: excludedTag.id,
      })
    : listTag;

  return {
    arr,
    isLoading,
    meta: data.meta,
  };
};

export default useTagOptions;
