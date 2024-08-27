import Copilot from '@/components/Copilot';
// import { BaseTable } from '@/components/Table/BaseTable';
import TopBar from '@/components/TopBar';
import ContentWrapper from '@/components/Wrapper/ContentWrapper';
import PageWrapper from '@/components/Wrapper/PageWrapper';
import ReportContent from './_components/ReportContent';

const ReportPage = () => {
  return (
    <PageWrapper>
      <TopBar title="Management Report" />
      <ContentWrapper>
        <ReportContent />
        <Copilot className="absolute right-5 md:static" />
      </ContentWrapper>
    </PageWrapper>
  );
};

export default ReportPage;
