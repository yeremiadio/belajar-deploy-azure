import { ReactNode, RefObject } from 'react';
import { useSelector } from 'react-redux';

import { cn } from '@/lib/utils';
import { selectLanguage } from '@/stores/languageStore/languageSlice';
import { localization } from '@/utils/functions/localization';
import Breadcrumb from '@/components/Breadcrumb';
import { TBreadcrumbItem } from '@/types/topbar';

import ControlList from './_components/ControlList';
import Datetime from './_components/Datetime';
import Card from '../Card';

type Props = {
  title: string;
  additionalTitle?: string;
  additionalTitleColor?: string;
  isFloating?: boolean;
  topBarRef?: RefObject<HTMLDivElement>;
  breadcrumb?: TBreadcrumbItem[];
  rightAddon?: ReactNode;
};

export default function TopBar({
  title,
  topBarRef,
  breadcrumb,
  additionalTitleColor,
  additionalTitle,
  isFloating,
  rightAddon,
}: Props) {
  const language = useSelector(selectLanguage);

  return (
    <div
      ref={topBarRef}
      className={cn(
        'mb-4 flex w-full justify-between',
        isFloating && 'z-10',
        rightAddon ? 'items-start' : 'items-center',
      )}
    >
      {isFloating ? (
        <Card className="flex w-fit items-center gap-4 px-4 py-2">
          <h1 className="text-2xl">{localization(title, language)}</h1>
          <Datetime />
        </Card>
      ) : (
        <div className=" flex flex-col">
          <div className="flex flex-row flex-wrap gap-4">
            <div className="white flex flex-wrap items-center gap-4 lg:flex-nowrap">
              <h1 className="flex items-center whitespace-nowrap text-2xl">
                {localization(title, language)}
                {additionalTitle && ' \u00A0- \u00A0'}
                {additionalTitle && (
                  <div className={additionalTitleColor}>{additionalTitle}</div>
                )}
              </h1>
              <Datetime />
            </div>
            {rightAddon}
          </div>
          {breadcrumb && <Breadcrumb items={breadcrumb} />}
        </div>
      )}
      <ControlList />
    </div>
  );
}
