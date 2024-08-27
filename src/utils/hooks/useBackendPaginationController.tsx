import { useState } from 'react';

type PaginationDefaultValues = {
  defaultPage?: number;
  defaultTake?: number;
};

const useBackendPaginationController = (values?: PaginationDefaultValues) => {
  const { defaultPage, defaultTake } = values ?? {};
  const [page, setPage] = useState(
    defaultPage && defaultPage >= 1 ? defaultPage : 1,
  );
  const [take, setLimit] = useState(
    defaultTake && defaultTake >= 1 ? defaultTake : 10,
  );

  return {
    page,
    setPage,
    take,
    setLimit,
  };
};

export default useBackendPaginationController;
