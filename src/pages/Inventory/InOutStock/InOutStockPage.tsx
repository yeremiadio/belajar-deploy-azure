import { ColumnDef, Row } from '@tanstack/react-table';
import { FC, useEffect, useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { useSearchParams } from 'react-router-dom';

import Copilot from '@/components/Copilot';
import Modal from '@/components/Modal';
import { BaseTable } from '@/components/Table/BaseTable';
import TableBackendPagination from '@/components/Table/BaseTable/_components/TableBackendPagination';
import TopBar from '@/components/TopBar';
import ContentWrapper from '@/components/Wrapper/ContentWrapper';
import PageWrapper from '@/components/Wrapper/PageWrapper';
import { Button } from '@/components/ui/button';

import filterObjectIfValueIsEmpty from '@/utils/functions/filterObjectIfValueIsEmpty';
import { removeEmptyObjects } from '@/utils/functions/removeEmptyObjects';
import useBackendPaginationController from '@/utils/hooks/useBackendPaginationController';
import { useDebounce } from '@/utils/hooks/useDebounce';
import { useModal } from '@/utils/hooks/useModal';

import { useGetInventoryQuery } from '@/stores/managementStore/inventoryStore';

import { TInventoryTransaction } from '@/types/api/inventory';
import { IInventory } from '@/types/api/management/inventory';

import { setHtmlRefId } from '@/stores/htmlRefStore/htmlRefSlice';
import useAppDispatch from '@/utils/hooks/useAppDispatch';
import InventoryTransactionTable from './_components/InventoryTransactionTable';
import TransactionForm from './_components/TransactionForm';

const InOutStockPage: FC = () => {
  const htmlId = 'inOutStockId';
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setHtmlRefId(htmlId));
  }, [dispatch]);

  // useSearchParams
  const [searchParams, setSearchParams] = useSearchParams();
  const searchNameParams = searchParams.get('search');
  const getPageParams = searchParams.get('page');
  const getTakeParams = searchParams.get('take');

  const [searchName, setSearchName] = useState<string>(searchNameParams ?? '');
  const debouncedSearchName = useDebounce(searchName, 1500);

  const [selectedInventory, setSelectedInventory] = useState<IInventory>();
  const [selectedTransaction, setSelectedTransaction] =
    useState<TInventoryTransaction>();

  const { page, setPage, take, setLimit } = useBackendPaginationController(
    filterObjectIfValueIsEmpty({
      defaultPage: 1,
      defaultTake: 10,
    }),
  );

  // re-assign params
  useEffect(() => {
    if (debouncedSearchName && debouncedSearchName.length > 1) {
      searchParams.set('search', debouncedSearchName);
      searchParams.set('page', '1');
    } else {
      searchParams.delete('search');
    }
    setSearchParams(searchParams);
  }, [debouncedSearchName]);

  const activeFilter = removeEmptyObjects({
    page: getPageParams ?? page,
    take: getTakeParams ?? take,
    search: debouncedSearchName,
  });

  const { data: inventoryData, isLoading: isLoadingInventory } =
    useGetInventoryQuery(activeFilter);

  const { isShown: isShownAddTransaction, toggle: toggleTransaction } =
    useModal();

  const toggleTransactionForm = (open?: boolean) => {
    if (isShownAddTransaction === true) {
      setSelectedInventory(undefined);
      setSelectedTransaction(undefined);
    }
    toggleTransaction(open);
  };

  const columns: ColumnDef<IInventory>[] = [
    {
      accessorKey: 'uniqueId',
      header: 'Inventory ID',
    },
    {
      accessorKey: 'name',
      header: 'Inventory Name',
    },
    {
      accessorKey: 'type',
      header: 'Inventory Type',
    },
    {
      accessorKey: 'unit',
      header: 'Unit',
    },
    {
      accessorKey: 'stock',
      header: 'Stock',
    },
    {
      header: 'Action',
      cell: ({ row: { original } }) => {
        const handleOnClick = () => {
          setSelectedInventory(original);
          toggleTransactionForm(true);
        };

        return (
          <Button
            className="btn-secondary-navy-blue hover:hover-btn-secondary-navy-blue"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleOnClick();
            }}
          >
            Add Transaction <AiOutlinePlus className="ml-2" />
          </Button>
        );
      },
    },
  ];

  return (
    <PageWrapper>
      <TopBar title="In Out Stock" isFloating={false} />
      <Modal
        title={!!selectedTransaction ? 'Edit Transaction' : 'Add Transaction'}
        toggle={toggleTransactionForm}
        isShown={isShownAddTransaction}
      >
        <TransactionForm
          toggle={toggleTransactionForm}
          inventory={selectedInventory}
          transaction={selectedTransaction}
        />
      </Modal>
      <ContentWrapper id={htmlId}>
        <div className="w-full">
          <BaseTable
            columns={columns}
            data={inventoryData?.entities ?? []}
            onSearchInput
            meta={inventoryData?.meta}
            isLoading={isLoadingInventory}
            onSearchInputChange={setSearchName}
            searchInputValue={searchName}
            withToolbar
            additionalSuffixToolbarElement={
              <Button
                className="btn-primary-mint hover:hover-btn-primary-mint"
                onClick={() => toggleTransactionForm(true)}
                type="button"
              >
                Add Transaction <AiOutlinePlus className="ml-2" />
              </Button>
            }
            backendPagination={
              inventoryData?.meta && (
                <TableBackendPagination
                  page={page}
                  take={take}
                  meta={inventoryData?.meta}
                  setLimit={setLimit}
                  setPage={setPage}
                />
              )
            }
            renderExpansion={(row: Row<IInventory>) => (
              <InventoryTransactionTable
                inventoryData={row}
                toggleTransactionForm={toggleTransactionForm}
                setSelectedTransaction={setSelectedTransaction}
              />
            )}
          />
        </div>

        <Copilot />
      </ContentWrapper>
    </PageWrapper>
  );
};

export default InOutStockPage;
