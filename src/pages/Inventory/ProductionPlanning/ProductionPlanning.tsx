import { FC } from 'react';

import TopBar from '@/components/TopBar';
import PageWrapper from '@/components/Wrapper/PageWrapper';
import ContentWrapper from '@/components/Wrapper/ContentWrapper';

import CalendarProductionPlanning from './_components/CalendarProductionPlan';

const ProductionPlanningPage: FC = () => {
  return (
    <PageWrapper>
      <TopBar title="Production Planning" />
      <ContentWrapper className="flex flex-col">
        <CalendarProductionPlanning />
      </ContentWrapper>
    </PageWrapper>
  );
};

export default ProductionPlanningPage;
