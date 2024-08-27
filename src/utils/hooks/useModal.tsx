import { TModalProps } from '@/types/modal';
import { useState } from 'react';

export const useModal = (): Pick<TModalProps, 'isShown' | 'toggle'> => {
  const [isShown, setIsShown] = useState<boolean>(false);
  /**
   *
   * @param value diharapkan boolean
   * @returns
   */
  const toggle = (value?: any) =>
    setIsShown((prev) => {
      if (typeof value === 'boolean') {
        return value;
      }
      return !prev;
    });

  return {
    isShown,
    toggle,
  };
};
