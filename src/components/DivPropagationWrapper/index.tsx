import { CSSProperties, ReactNode } from 'react';

type Props = {
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
};
/**
 *
 * @description In Bahasa, Komponen ini bertujuan
 * untuk wrapping jikalau ada button aksi di cell table
 * yang memiliki expand.
 *
 * menghentikan penyebaran (propagation) dari suatu event ke elemen-elemen lain dalam hierarki DOM.
 * @returns
 */
const DivPropagationWrapper = ({ children, className, style }: Props) => {
  return (
    <div
      className={className}
      style={style}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  );
};

export default DivPropagationWrapper;
