import { useEffect } from 'react';

import { Meta } from '@/types/api';

/**
 * @description Pagination Dropdown Select Option
 */

export const SelectLoading = ({
  onLoad,
  meta,
}: {
  onLoad: () => void;
  meta?: Meta;
}) => {
  if (meta && meta.pageCount > 1) {
    useEffect(() => {
      setTimeout(onLoad, 1000);
    }, [meta]);

    return <div>Loading...</div>;
  } else {
    return null;
  }
};
