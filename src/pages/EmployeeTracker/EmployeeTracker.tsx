import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

import Copilot from '@/components/Copilot';
import TopBar from '@/components/TopBar';
import ContentWrapper from '@/components/Wrapper/ContentWrapper';
import PageWrapper from '@/components/Wrapper/PageWrapper';

import Card from '@/components/Card';

import { setHtmlRefId } from '@/stores/htmlRefStore/htmlRefSlice';
import { selectLanguage } from '@/stores/languageStore/languageSlice';

import useElementDimensions from '@/utils/hooks/useElementDimension';
import useAppSelector from '@/utils/hooks/useAppSelector';
import { localization } from '@/utils/functions/localization';

import useAppDispatch from '@/utils/hooks/useAppDispatch';

import { cn } from '@/lib/utils';

import LocationMonitoring from './_components/LocationMonitoring';
import EmployeeActivities from './_components/EmployeeActivities';

const EmployeeTracker = () => {
  const dispatch = useAppDispatch();
  const htmlId = 'employeeTrackerId';

  const topBarRef = useRef<HTMLDivElement>(null);
  const topBarDimension = useElementDimensions(topBarRef);
  const occupiedHeight = topBarDimension.height + 42;

  const [searchParams, setSearchParams] = useSearchParams();
  const viewParameter = searchParams.get('view');

  const language = useAppSelector(selectLanguage);

  useEffect(() => {
    dispatch(setHtmlRefId(htmlId));
  }, [dispatch]);

  const handleClickViewParameter = (view: 'location' | 'activities') => {
    if (view === 'location') {
      const clearParams = ['search', 'date', 'shift'];
      clearParams.forEach((param) => searchParams.delete(param));
    } else if (view === 'activities') {
      searchParams.set('shift', '1');
    }
    searchParams.set('view', view);
    setSearchParams(searchParams);
  };

  useEffect(() => {
    if (!viewParameter) {
      handleClickViewParameter('location');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewParameter]);

  return (
    <PageWrapper>
      <TopBar
        topBarRef={topBarRef}
        title="Unitrace - Employee"
        rightAddon={
          <Card className="h-full w-fit rounded-md p-2">
            <div className="align-center flex gap-2">
              <div
                className={cn(
                  'px-4 py-2',
                  viewParameter === 'location'
                    ? 'bg-rs-v2-dark-grey'
                    : 'bg-transparent',
                  'cursor-pointer transition-all ease-in-out',
                )}
                onClick={() => handleClickViewParameter('location')}
              >
                <span
                  className={cn(
                    viewParameter === 'location'
                      ? 'text-rs-v2-mint'
                      : 'text-rs-v2-light-grey',
                    'whitespace-nowrap text-sm',
                  )}
                >
                  {localization('Location Monitoring', language)}
                </span>
              </div>
              <div
                className={cn(
                  'px-4 py-2',
                  viewParameter === 'activities'
                    ? 'bg-rs-v2-dark-grey'
                    : 'bg-transparent',
                  'cursor-pointer transition-all ease-in-out',
                )}
                onClick={() => handleClickViewParameter('activities')}
              >
                <span
                  className={cn(
                    viewParameter === 'activities'
                      ? 'text-rs-v2-mint'
                      : 'text-rs-v2-light-grey',
                    'whitespace-nowrap text-sm',
                  )}
                >
                  {localization('Employee Activities', language)}
                </span>
              </div>
            </div>
          </Card>
        }
      />
      <ContentWrapper id={htmlId}>
        <div
          style={{ maxHeight: `calc(100vh - ${occupiedHeight}px)` }}
          className={`relative flex w-full overflow-x-auto overflow-y-auto`}
        >
          {viewParameter === 'location' ? (
            <LocationMonitoring />
          ) : (
            <EmployeeActivities />
          )}
        </div>
        <Copilot />
      </ContentWrapper>
    </PageWrapper>
  );
};

export default EmployeeTracker;
