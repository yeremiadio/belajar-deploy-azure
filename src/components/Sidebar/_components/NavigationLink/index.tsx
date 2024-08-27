import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Link, useLocation } from 'react-router-dom';

import { cn } from '@/lib/utils';

import { selectLanguage } from '@/stores/languageStore/languageSlice';

import { KiddoItem, NavigationItem } from '@/types/sidebar';

import { localization } from '@/utils/functions/localization';
import useAppSelector from '@/utils/hooks/useAppSelector';

type Props = {
  navItem: NavigationItem;
  collapse: boolean;
};

export default function NavigationLink({ navItem, collapse }: Props) {
  const currentUrl = useLocation().pathname;
  const parentActive = currentUrl.startsWith(navItem?.url);
  const isCollapse = collapse;

  const language = useAppSelector(selectLanguage);

  const parentItem = (
    <div
      className={`flex min-h-[40px] items-center px-4 py-2 ${
        isCollapse ? 'justify-center' : 'w-[200px]'
      } gap-3 transition-all group-hover:text-white ${
        parentActive ? 'text-white' : 'text-rs-neutral-dark-platinum'
      }`}
    >
      {navItem && typeof navItem.icon === 'string' ? (
        <img
          src={navItem.icon}
          className={`flex-shrink-0 ${
            parentActive ? 'text-white' : 'text-rs-neutral-dark-platinum'
          }`}
        />
      ) : navItem && navItem.icon ? (
        <navItem.icon className="max-w-[20px] text-[20px]" />
      ) : null}
      {collapse ? null : (
        <p className="text-left">
          {navItem && localization(navItem.name, language)}
        </p>
      )}
    </div>
  );

  const childItem = (childNavItem: KiddoItem, key: number) => {
    const formatChildNavItem = (name: string) =>
      name?.replace(/-/g, ' ')?.replace(/\b\w/g, (char) => char?.toUpperCase());
    const childActive = childNavItem?.url === currentUrl;
    return (
      <Link
        to={childNavItem?.url}
        className={childNavItem?.disabled ? 'pointer-events-none' : ''}
        key={key}
      >
        <div
          className={`flex min-h-[40px] items-center px-4 py-0 ${
            isCollapse ? 'justify-center' : 'w-full'
          } gap-3 transition-all group-hover:text-white ${
            childActive ? 'text-white' : 'text-rs-neutral-dark-platinum'
          }`}
        >
          {childNavItem?.iconShrink && isCollapse ? (
            typeof childNavItem?.iconShrink === 'string' ? (
              <img src={childNavItem?.iconShrink} className="h-3.5" />
            ) : (
              <childNavItem.iconShrink />
            )
          ) : null}
          {collapse ? null : (
            <p className="ms-9 hover:text-white">
              {formatChildNavItem(childNavItem?.name)}
            </p>
          )}
        </div>
      </Link>
    );
  };

  if (navItem && !navItem?.kiddos) {
    return (
      <Link
        to={navItem?.url}
        className={cn(
          'group cursor-pointer',
          navItem.disabled && 'pointer-events-none',
        )}
      >
        {parentItem}
      </Link>
    );
  }

  if (navItem && navItem?.kiddos) {
    return (
      <Accordion type="single" collapsible key={navItem?.name}>
        <AccordionItem
          value={navItem?.name}
          className="border-0"
          data-state="open"
        >
          <AccordionTrigger
            className={`group relative py-0 pe-0 hover:text-white hover:no-underline [&>svg]:absolute [&>svg]:right-5 [&>svg]:text-rs-neutral-dark-platinum [&>svg]:hover:text-white ${
              isCollapse
                ? ' justify-center [&>svg]:hidden'
                : 'w-[260px] overflow-x-hidden'
            }`}
          >
            {parentItem}
          </AccordionTrigger>
          <AccordionContent
            className={cn(
              'pb-0',
              navItem.kiddos.length >= 5 ||
                (navItem.name !== 'Management' &&
                  'overflow-y-auto overflow-x-hidden'),
            )}
          >
            {navItem.kiddos.map((childNavItem, index) => {
              return childItem(childNavItem, index);
            })}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  }
}
