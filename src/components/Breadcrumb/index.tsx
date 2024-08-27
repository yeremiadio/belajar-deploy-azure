import { FC, Fragment } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { cn } from '@/lib/utils';
import { TBreadcrumbItem } from '@/types/topbar';

interface Props {
  items: TBreadcrumbItem[];
  className?: string;
}

const Breadcrumb: FC<Props> = ({ items, className }) => {
  const location = useLocation();

  return (
    <nav className={cn(className)}>
      <ul className="flex flex-row">
        {items.map((item, index) => (
          <Fragment key={index}>
            <li
              className={cn('cursor-pointer hover:underline', {
                'text-rs-v2-mint': location.pathname === item.path,
                'text-rs-v2-light-grey': location.pathname !== item.path,
              })}
            >
              {item.clickable ? (
                <Link to={item.path}>{item.label}</Link>
              ) : (
                <span>{item.label}</span>
              )}
            </li>
            {index < items.length - 1 && <span className="px-1">/</span>}
          </Fragment>
        ))}
      </ul>
    </nav>
  );
};

export default Breadcrumb;
