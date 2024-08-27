import { useState } from 'react';
import { IoChevronBackSharp } from 'react-icons/io5';
import { MdLogout } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { RapidsenseLogo } from '@/assets/images';

import Card from '@/components/Card';

import { cn } from '@/lib/utils';

import {
  selectLanguage,
  setLanguage,
} from '@/stores/languageStore/languageSlice';

import { ROUTES } from '@/utils/configs/route';
import { localization } from '@/utils/functions/localization';
import { useDebounce } from '@/utils/hooks/useDebounce';
import useLogout from '@/utils/hooks/useLogout';
import useGetNavigationList from '@/utils/hooks/useGetNavigationList';

import NavigationLink from './_components/NavigationLink';
import Profile from './_components/Profile';
import { NavigationItem } from '@/types/sidebar';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';

export default function Sidebar() {
  const { navigationListByGroup } = useGetNavigationList();
  const currentUrl = useLocation().pathname;

  const [isExpanded, setIsExpanded] = useState(true);
  const [isHovering, setIsHovering] = useState(false);

  const hoverDebounce = useDebounce(isHovering, 300);
  const { logout } = useLogout();

  const navigate = useNavigate();

  const handleExpand = () => {
    setIsHovering(false);
    setIsExpanded(!isExpanded);
  };

  const handleHoverIn = () => {
    if (isExpanded) return;
    setIsHovering(true);
  };

  const handleHoverOut = () => {
    if (isExpanded) return;
    setIsHovering(false);
  };

  const handleLogout = () => {
    logout();
  };

  const expandSidebar = isExpanded || hoverDebounce;

  const language = useSelector(selectLanguage);
  const dispatch = useDispatch();

  const handleLocalization = () => {
    dispatch(setLanguage(language === 'en' ? 'id' : 'en'));
  };

  return (
    <Card
      // 2.5 rem is top + bottom padding of the main container
      className={cn(
        'sticky left-0 top-5 z-10 flex h-[calc(100vh-2rem)] flex-col overflow-hidden transition-all duration-500 ease-in-out',
        expandSidebar ? 'w-[200px]' : 'w-[90px]',
      )}
      onMouseEnter={handleHoverIn}
      onMouseLeave={handleHoverOut}
    >
      <img
        src={RapidsenseLogo}
        alt="rapidsense"
        className="mx-auto cursor-pointer py-6"
        onClick={() => {
          navigate(ROUTES.dashboard);
        }}
      />

      <div className="h-full overflow-y-auto overflow-x-hidden">
        {navigationListByGroup?.map((group, index) => {
          let parentActive = false;
          if (group?.navigation?.length > 0) {
            const currentUrlArr = currentUrl.split('/');
            parentActive = group?.navigation?.some((navItem) =>
              currentUrlArr.includes(navItem.url.split('/')[1]),
            );
          }

          return group?.navigation?.length > 0 && !!group?.label ? (
            <Accordion
              type="single"
              collapsible
              key={index}
              defaultValue={`group-${index}`}
              className="mt-3"
            >
              <AccordionItem
                value={`group-${index}`}
                className="border-0"
                data-state="open"
              >
                <AccordionTrigger
                  className={cn(
                    `group relative py-0 pe-0 hover:text-white hover:no-underline [&>svg]:absolute [&>svg]:right-5 [&>svg]:text-rs-neutral-dark-platinum 
                    [&>svg]:hover:text-white`,
                    parentActive
                      ? 'text-white'
                      : 'text-rs-neutral-dark-platinum',
                    !expandSidebar
                      ? ' justify-center [&>svg]:hidden'
                      : 'w-[260px] overflow-x-hidden',
                  )}
                >
                  <p className="px-4 font-semibold">
                    {expandSidebar ? group?.label : group?.shortLabel}
                  </p>
                </AccordionTrigger>
                <AccordionContent
                  className={cn('overflow-y-auto overflow-x-hidden pb-0')}
                >
                  {group?.navigation?.map((navItem, key) => (
                    <NavigationLink
                      navItem={navItem as NavigationItem}
                      collapse={!expandSidebar}
                      key={key}
                    />
                  ))}
                  {(index + 1 !== navigationListByGroup?.length ||
                    index === 0) && (
                    <span
                      className={cn(
                        'mx-auto mb-2 mt-1 block w-[calc(100%-2rem)] border-b border-b-rs-v2-thunder-blue px-2',
                      )}
                    ></span>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ) : (
            group?.navigation?.map((navItem, key) => (
              <NavigationLink
                navItem={navItem as NavigationItem}
                collapse={!expandSidebar}
                key={key}
              />
            ))
          );
        })}
      </div>

      <div className="bottom mt-auto">
        <div className="flex flex-col px-4">
          <button
            onClick={handleLogout}
            className={cn(
              'hover:text-rs-alert/80 mt-5 flex w-fit gap-2 text-rs-v2-red ',
              !expandSidebar && 'mx-auto',
            )}
          >
            <MdLogout className="text-2xl" />
            {expandSidebar ? <p>{localization('Logout', language)}</p> : null}
          </button>
          <div className="my-6 h-[1px] w-full bg-[#343F518A]" />
          <Profile collapse={!expandSidebar} />
          <div className="my-6 h-[1px] w-full bg-[#343F518A]" />
          <div className="flex w-full flex-col gap-3">
            <p className="text-xs font-medium text-rs-v2-space">
              {localization('Language', language)}
            </p>
            {expandSidebar ? (
              <div
                className="flex w-full cursor-pointer items-center gap-3 text-sm font-medium outline-none"
                onClick={handleLocalization}
              >
                <p>EN</p>
                <button className="relative h-7 w-14 cursor-pointer rounded-full bg-rs-v2-mint outline-none drop-shadow-[0px_4px_11px_-8px_#111928]">
                  <span
                    className={cn(
                      'absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-white',
                      language === 'en'
                        ? 'animate-switch-en'
                        : 'animate-switch-id',
                    )}
                  />
                </button>
                <p>ID</p>
              </div>
            ) : (
              <div
                className="flex w-full cursor-pointer flex-col items-center justify-center gap-3 text-sm font-medium outline-none"
                onClick={handleLocalization}
              >
                <button className="relative h-7 w-14 cursor-pointer rounded-full bg-rs-v2-mint outline-none drop-shadow-[0px_4px_11px_-8px_#111928]">
                  <span
                    className={cn(
                      'absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-white',
                      language === 'en'
                        ? 'animate-switch-en'
                        : 'animate-switch-id',
                    )}
                  />
                </button>
                <p>{language.toUpperCase()}</p>
              </div>
            )}
          </div>
        </div>
        <button
          className="group mt-7 flex h-[40px] w-full items-center justify-center rounded-b-xl bg-rs-v2-deep-indigo hover:bg-rs-v2-deep-indigo/80"
          onClick={handleExpand}
        >
          <IoChevronBackSharp
            className={`${
              expandSidebar ? 'rotate-0' : 'rotate-180'
            } ease-in-out" transition-transform`}
          />
        </button>
      </div>
    </Card>
  );
}
