import { useRef } from 'react';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';

import Copilot from '@/components/Copilot';
import TopBar from '@/components/TopBar';
import ContentWrapper from '@/components/Wrapper/ContentWrapper';
import PageWrapper from '@/components/Wrapper/PageWrapper';

import useElementDimensions from '@/utils/hooks/useElementDimension';

import AccountSetting from './_components/AccountSetting';
import PasswordSetting from './_components/PasswordSetting';

const ProfilePage = () => {
  const topBarRef = useRef<HTMLDivElement>(null);
  const topBarDimension = useElementDimensions(topBarRef);
  const occupiedHeight = topBarDimension.height + 42;

  return (
    <PageWrapper>
      <TopBar title="Profile" />
      <ContentWrapper
        className="overflow-hidden"
        style={{
          maxHeight: `calc(100vh - ${occupiedHeight}px)`,
        }}
      >
        <OverlayScrollbarsComponent
          className="flex h-full w-full"
          options={{ scrollbars: { autoHide: 'scroll', theme: 'os-theme-rs' } }}
          defer
        >
          <AccountSetting />
          <PasswordSetting />
        </OverlayScrollbarsComponent>
        <Copilot className="absolute right-5 md:static" />
      </ContentWrapper>
    </PageWrapper>
  );
};

export default ProfilePage;
