import React from "react";

type PaginationDefaultValues = {
  defaultPage?: number;
  defaultTake?: number;
};

const useCustomPaginationController = (values?: PaginationDefaultValues) => {
  const { defaultPage, defaultTake } = values ?? {};
  const [page, setPage] = React.useState(
    defaultPage && defaultPage >= 1 ? defaultPage : 1,
  );
  const [take, setLimit] = React.useState(
    defaultTake && defaultTake >= 1 ? defaultTake : 10,
  );

  return {
    page,
    setPage,
    take,
    setLimit,
  };
};

export default useCustomPaginationController;
