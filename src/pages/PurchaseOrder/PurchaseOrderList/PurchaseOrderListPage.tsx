import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import TopBar from '@/components/TopBar';
import ContentWrapper from '@/components/Wrapper/ContentWrapper';
import PageWrapper from '@/components/Wrapper/PageWrapper';
import Copilot from '@/components/Copilot';

import { setHtmlRefId } from '@/stores/htmlRefStore/htmlRefSlice';

import { ROUTES } from '@/utils/configs/route';
import { useDebounce } from '@/utils/hooks/useDebounce';
import useAppDispatch from '@/utils/hooks/useAppDispatch';

import PurchaseOrderBoard from './_components/PurchaseOrderBoard';
import ToolbarAction from './_components/ToolbarAction';

const PurchaseOrderListPage = () => {
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState('');
  const keywordDebounce = useDebounce(searchKeyword, 500);
  const dispatch = useAppDispatch();
  const htmlId = 'purchaseOrderListId';

  useEffect(() => {
    dispatch(setHtmlRefId(htmlId));
  }, [dispatch]);

  const handleCreateOrder = () => {
    navigate(ROUTES.purchaseOrderCreate);
  };

  return (
    <PageWrapper>
      <TopBar title="Purchase Order" isFloating={false} />
      <ContentWrapper id={htmlId}>
        <div className="flex w-full flex-col gap-6">
          <ToolbarAction
            searchKeyword={searchKeyword}
            setSearchKeyword={setSearchKeyword}
            handleCreateOrder={handleCreateOrder}
          />
          <PurchaseOrderBoard searchKeyword={keywordDebounce} />
        </div>
        <Copilot />
      </ContentWrapper>
    </PageWrapper>
  );
};

export default PurchaseOrderListPage;
