import { useEffect, useMemo, useState, useRef } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { useSearchParams } from 'react-router-dom';
import { ColumnDef, Row } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { MdDeleteOutline, MdHistory } from 'react-icons/md';

import Spinner from '@/components/Spinner';
import Copilot from '@/components/Copilot';
import DivPropagationWrapper from '@/components/DivPropagationWrapper';
import Modal from '@/components/Modal';
import { BaseTable } from '@/components/Table/BaseTable';
import { ExpansionTable } from '@/components/Table/ExpansionTable';
import TableBackendPagination from '@/components/Table/BaseTable/_components/TableBackendPagination';
import TopBar from '@/components/TopBar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import ContentWrapper from '@/components/Wrapper/ContentWrapper';
import PageWrapper from '@/components/Wrapper/PageWrapper';
import {
  DrawerClose,
  DrawerFooter,
  DrawerTrigger,
} from '@/components/ui/drawer';

import { setHtmlRefId } from '@/stores/htmlRefStore/htmlRefSlice';
import {
  useGetWorkOrderQuery,
  useUpdateRunWorkOrderMutation,
  useUpdateStopWorkOrderMutation,
  useUpdatePausedWorkOrderMutation,
  useDeleteWorkOrderMutation,
} from '@/stores/inventoryStore/workOrderStore/workOrderStoreApi';

import { ErrorMessageBackendDataShape } from '@/types/api';
import {
  IWorkOrderResponse,
  WorkOrderStatusEnum,
} from '@/types/api/inventory/workOrder';

import filterObjectIfValueIsEmpty from '@/utils/functions/filterObjectIfValueIsEmpty';
import generateDynamicToastMessage from '@/utils/functions/generateDynamicToastMessage';
import generateStatusCodesMessage from '@/utils/functions/generateStatusCodesMessage';
import { removeEmptyObjects } from '@/utils/functions/removeEmptyObjects';
import useElementDimensions from '@/utils/hooks/useElementDimension';
import useBackendPaginationController from '@/utils/hooks/useBackendPaginationController';
import { useDebounce } from '@/utils/hooks/useDebounce';
import { useModal } from '@/utils/hooks/useModal';
import useAppDispatch from '@/utils/hooks/useAppDispatch';

import OeeThresholdForm from './_components/OeeThresholdForm';
import WorkOrderForm from './_components/WorkOrderForm';
import TabSwitch from './_components/TabSwitch';
import useAppSelector from '@/utils/hooks/useAppSelector';
import {
  modalViewInventoryOpen,
  toggleModalView,
} from '@/stores/inventoryStore/inventorySlice';
import ProductionOutputForm from './_components/ProductionOutputForm';
import ProductionHistory from './_components/ProductionHistory';

const WorkOrderPage = () => {
  const htmlId = 'workOrderId';
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setHtmlRefId(htmlId));
  }, [dispatch]);
  const isModalViewInventoryOpen = useAppSelector(modalViewInventoryOpen);
  const handleModalInventoryView = () => {
    dispatch(toggleModalView());
  };
  const { toggle, isShown } = useModal();
  const { toggle: toggleOeeForm, isShown: isShownOeeForm } = useModal();
  const { toast } = useToast();

  const topElementRef = useRef<HTMLDivElement>(null);
  const topElementDimension = useElementDimensions(topElementRef);
  const occupiedHeight = topElementDimension.height + 42;

  // useSearchParams
  const [searchParams, setSearchParams] = useSearchParams();
  const searchWorkOrderParams = searchParams.get('search');
  const selectedViewParams = searchParams.get('view');
  const getPageParams = searchParams.get('page');
  const getTakeParams = searchParams.get('take');

  const [inputSearch, setInputSearch] = useState<string>(
    searchWorkOrderParams ?? '',
  );
  const debouncedSearch = useDebounce(inputSearch, 1500);

  const [selectedView, setSelectedView] = useState<string>(
    selectedViewParams ?? 'active',
  );

  const { page, setPage, take, setLimit } = useBackendPaginationController(
    filterObjectIfValueIsEmpty({
      defaultPage: 1,
      defaultTake: 10,
    }),
  );

  // re-assign params
  useEffect(() => {
    if (debouncedSearch && debouncedSearch.length > 1) {
      searchParams.set('search', debouncedSearch);
      searchParams.set('page', '1');
      searchParams.set('take', '10');
    } else {
      searchParams.delete('search');
    }
    setSearchParams(searchParams);
  }, [debouncedSearch]);

  const handleClickselectedViewParams = (view: 'active' | 'completed') => {
    setSelectedView(view);
  };

  useEffect(() => {
    if (selectedView) {
      searchParams.set('view', selectedView);
      searchParams.set('page', '1');
      searchParams.set('take', '10');
    } else {
      searchParams.delete('view');
    }
    setSearchParams(searchParams);
  }, [selectedView]);

  const activeFilter = removeEmptyObjects({
    page: getPageParams ?? page,
    take: getTakeParams ?? take,
    search: debouncedSearch,
    isActive: selectedViewParams
      ? selectedViewParams === 'active'
      : selectedView
        ? selectedView === 'active'
        : false,
  });

  const {
    data: workOrderData,
    isLoading,
    isFetching,
  } = useGetWorkOrderQuery({
    ...activeFilter,
    ...(selectedViewParams && { isActive: selectedViewParams === 'active' }),
  });
  const loading = isLoading || isFetching;
  const dataWorkOrderMeta = useMemo(() => {
    return workOrderData?.meta;
  }, [workOrderData]);

  const workOrdersMemo = useMemo<IWorkOrderResponse[]>(() => {
    if (!workOrderData) return [];
    const tagList = workOrderData.entities.slice();
    return tagList;
  }, [workOrderData]);

  const expandColumns: ColumnDef<IWorkOrderResponse>[] = [
    {
      accessorKey: 'targetoutput',
      id: 'targetProduction',
      header: 'Target Production',
    },
    {
      accessorKey: 'actualoutput',
      id: 'actualProduction',
      header: 'Actual Production',
    },
    {
      accessorKey: 'quantityng',
      id: 'ng',
      header: 'Not Good',
    },
    {
      id: 'loadingTime',
      header: 'Loading Time',
      accessorFn: (row) => {
        return row.loadingTime ?? '-';
      },
    },
    {
      id: 'stopTime',
      header: 'Stop Time',
      accessorFn: (row) => {
        return row.stopTime ?? '-';
      },
    },
    {
      id: 'operationTime',
      header: 'Operation Time',
      accessorFn: (row) => {
        return row.starttime ?? '-';
      },
    },
    {
      accessorKey: 'oee',
      id: 'oee',
      header: 'OEE',
      cell: ({ row: { original } }) => {
        const value = original.oee
        return value ? `${value} %` : '-'
      },
    },
    {
      accessorKey: 'availability',
      id: 'availability',
      header: 'Availability',
      cell: ({ row: { original } }) => {
        const value = original.availability
        return value ? `${value} %` : '-'
      },
    },
    {
      accessorKey: 'performance',
      id: 'performance',
      header: 'Performance',
      cell: ({ row: { original } }) => {
        const value = original.performance
        return value ? `${value} %` : '-'
      },
    },
    {
      accessorKey: 'quality',
      id: 'quality',
      header: 'Quality',
      cell: ({ row: { original } }) => {
        const value = original.quality
        return value ? `${value} %` : '-'
      },
    },
  ];

  const columns: ColumnDef<IWorkOrderResponse>[] = [
    {
      accessorKey: 'name',
      id: 'workOrderName',
      header: 'Work Order Name',
    },
    {
      accessorKey: 'name',
      id: 'recipe',
      header: 'Recipe',
      cell: ({ row: { original } }) => {
        return original?.recipe?.name ?? '-';
      },
    },
    {
      accessorKey: 'targetoutput',
      id: 'targetProduction',
      header: 'Target Production',
    },
    {
      accessorKey: 'actualoutput',
      id: 'actualProduction',
      header: 'Production Progress',
      cell: ({ row: { original } }) => {
        const targetProduction = original.targetoutput
        const actualProduction = original.actualoutput
        const ratio = actualProduction/targetProduction * 100
        return ratio ? `${ratio} %` : '-'
      },
    },
    {
      accessorKey: 'oee',
      id: 'oee',
      header: 'OEE',
      size: 150,
      cell: ({ row: { original } }) => {
        const value = original.oee
        return (
          <div className="min-w-[40px]">
          {value ? `${value} %` : '-'}
          </div>
        )
      },
    },
    {
      accessorKey: 'machine',
      id: 'machine',
      header: 'Machine',
      cell: ({ row: { original } }) => {
        return original?.machine?.name ?? '-';
      },
    },
    {
      accessorKey: 'targetrunning',
      id: 'plannedTime',
      header: 'Planned Time',
    },
    {
      accessorKey: 'downtime',
      id: 'scheduleDowntime',
      header: 'Schedule Downtime',
    },
    {
      accessorKey: 'startPlan',
      id: 'startEndPlanned',
      header: 'Start-End Planned',
      cell: ({ row: { original } }) => {
        return `${original?.startPlan ? `${dayjs(original?.startPlan).format('DD/MM/YYYY')} -` : '-'}  ${original?.endPlan ? dayjs(original?.endPlan).format('DD/MM/YYYY') : ''}`;
      },
    },
    {
      accessorKey: 'startActual',
      id: 'startEndActual',
      header: 'Start-End Actual',
      cell: ({ row: { original } }) => {
        return `${original?.startActual ? `${dayjs(original?.startActual).format('DD/MM/YYYY HH:mm')} -` : '-'}  ${original?.endActual ? dayjs(original?.endActual).format('DD/MM/YYYY HH:mm') : ''}`;
      },
    },
    {
      accessorKey: 'id',
      id: 'action',
      header: 'Action',

      cell: ({ row }) => {
        const data = row.original;
        const { toggle: toggleEdit, isShown: isShownEdit } = useModal();
        const { toggle: toggleDelete, isShown: isShownDelete } = useModal();
        const { toggle: toggleProdOutput, isShown: isShownProdOutput } =
          useModal();
        const { toggle: toggleProdHistory, isShown: isShownProdHistory } =
          useModal();
        const [stopWorkOrder] = useUpdateStopWorkOrderMutation();
        const [runWorkOrder] = useUpdateRunWorkOrderMutation();
        const [pauseWorkOrder] = useUpdatePausedWorkOrderMutation();
        const [deleteWorkOrder] = useDeleteWorkOrderMutation();
        const handleStop = () => {
          stopWorkOrder({ id: data.id })
            .unwrap()
            .then(() => {
              toast(
                generateDynamicToastMessage({
                  title: 'Success',
                  description: `Work Order ${data.name} is stopped successfully`,
                  variant: 'success',
                }),
              );
            })
            .catch((error: ErrorMessageBackendDataShape) => {
              const { title, message } = generateStatusCodesMessage(
                error.status,
              );
              toast(
                generateDynamicToastMessage({
                  title,
                  description: `${message} "\n${error?.data?.message ?? ''}"`,
                  variant: 'error',
                }),
              );
            });
        };

        const handleDelete = () => {
          deleteWorkOrder({ id: data.id })
            .unwrap()
            .then(() => {
              toast(
                generateDynamicToastMessage({
                  title: 'Success',
                  description: `Work Order ${data.name} deleted successfully`,
                  variant: 'success',
                }),
              );
              toggleDelete();
            })
            .catch((error: ErrorMessageBackendDataShape) => {
              const { title, message } = generateStatusCodesMessage(
                error.status,
              );
              toast(
                generateDynamicToastMessage({
                  title,
                  description: `${message} "\n${error?.data?.message ?? ''}"`,
                  variant: 'error',
                }),
              );

              toggleDelete();
            });
        };

        const handlePause = () => {
          pauseWorkOrder({ id: data.id })
            .unwrap()
            .then(() => {
              toast(
                generateDynamicToastMessage({
                  title: 'Success',
                  description: `Work Order ${data.name} is paused successfully`,
                  variant: 'success',
                }),
              );
            })
            .catch((error: ErrorMessageBackendDataShape) => {
              const { title, message } = generateStatusCodesMessage(
                error.status,
              );
              toast(
                generateDynamicToastMessage({
                  title,
                  description: `${message} "\n${error?.data?.message ?? ''}"`,
                  variant: 'error',
                }),
              );
            });
        };

        const handleStart = () => {
          runWorkOrder({ id: data.id })
            .unwrap()
            .then(() => {
              toast(
                generateDynamicToastMessage({
                  title: 'Success',
                  description: `Work Order ${data.name} is started successfully`,
                  variant: 'success',
                }),
              );
            })
            .catch((error: ErrorMessageBackendDataShape) => {
              const { title, message } = generateStatusCodesMessage(
                error.status,
              );
              toast(
                generateDynamicToastMessage({
                  title,
                  description: `${message} "\n${error?.data?.message ?? ''}"`,
                  variant: 'error',
                }),
              );
            });
        };

        const isPending = data.status === WorkOrderStatusEnum.PENDING;
        const isRunning = data.status === WorkOrderStatusEnum.RUNNING;
        const isPaused = data.status === WorkOrderStatusEnum.PAUSED;
        const isComplete = data.status === WorkOrderStatusEnum.COMPLETE;

        return (
          <DivPropagationWrapper>
            <Modal
              title="Edit Work Order"
              toggle={toggleEdit}
              isShown={isShownEdit}
            >
              <WorkOrderForm
                isEditing
                toggle={toggleEdit}
                id={data.id}
                data={data}
              />
            </Modal>
            <Modal
              title="Delete Work Order"
              toggle={toggleDelete}
              isShown={isShownDelete}
              description={
                <p>
                  Deleting "{`${data.name}`}" will result in its{' '}
                  <b>permanent</b> deletion from the system, impacting all
                  associated data related to this Work Order.
                </p>
              }
            >
              <DrawerFooter className="flex flex-row justify-end gap-4 px-0 pt-2 pb-0">
                <DrawerClose>
                  <Button className="btn-terinary-gray hover:hover-btn-terinary-gray">
                    Cancel
                  </Button>
                </DrawerClose>

                <DrawerTrigger>
                  <Button
                    className="btn-primary-danger hover:hover-btn-primary-danger"
                    onClick={handleDelete}
                  >
                    Delete
                  </Button>
                </DrawerTrigger>
              </DrawerFooter>
            </Modal>
            <Modal
              title="Production Output in 1 Hour"
              toggle={toggleProdOutput}
              isShown={isShownProdOutput}
            >
              <ProductionOutputForm
                toggle={toggleProdOutput}
                productionUnit={data?.recipe?.unit ?? 'Kg'}
                id={data.id}
              />
            </Modal>
            <Modal
              title="Production Log"
              toggle={toggleProdHistory}
              isShown={isShownProdHistory}
            >
              <ProductionHistory id={data.id} toggle={toggle} />
            </Modal>
            <div className="flex items-center gap-2">
              {selectedViewParams === 'active' &&
                (isPending ? (
                  <Button
                    onClick={() => {
                      toggleEdit();
                    }}
                    disabled={!isPending}
                    className="btn-secondary-navy-blue hover:hover-btn-secondary-navy-blue disabled:disabled-btn-disabled-neutral-dark-platinum"
                  >
                    Edit Work Order
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      toggleProdOutput();
                    }}
                    disabled={isPaused}
                    className="btn-outline-mint hover:hover-btn-outline-mint"
                  >
                    Add Production
                  </Button>
                ))}
              <Button
                onClick={handleStart}
                disabled={isRunning || isComplete}
                className="btn-mint-green hover:hover-btn-mint-green disabled:disabled-btn-disabled-neutral-dark-platinum"
              >
                {isPaused ? 'Resume' : isRunning ? 'Running...' : 'Start'}
              </Button>

              <Button
                onClick={isRunning ? handlePause : handleStop}
                disabled={isPending || isComplete}
                className="hover:hover-btn-primary-danger btn-primary-danger disabled:disabled-btn-disabled-neutral-dark-platinum"
              >
                {isRunning ? 'Pause' : 'Stop'}
              </Button>
              {selectedViewParams === 'active' &&
                (isPending ? (
                  <Button
                    onClick={() => toggleDelete()}
                    disabled={!isPending}
                    className="bg-transparent hover:bg-rs-v2-red px-[12px] py-[5px] text-rs-v2-red hover:text-white"
                  >
                    <MdDeleteOutline size={24} />
                  </Button>
                ) : (
                  <Button
                    onClick={() => toggleProdHistory()}
                    disabled={isPending}
                    className="bg-rs-alert-yellow hover:bg-rs-alert-yellow hover:opacity-75 px-[12px] py-[5px] text-white"
                  >
                    <MdHistory size={24} />
                  </Button>
                ))}
            </div>
          </DivPropagationWrapper>
        );
      },
    },
  ];

  return (
    <PageWrapper>
      <TopBar
        title="Management Work Order"
        isFloating={false}
        topBarRef={topElementRef}
      />
      {workOrdersMemo && workOrdersMemo.length > 0 && !loading ? (
        <Modal
          title="Work Order"
          toggle={handleModalInventoryView}
          isShown={isModalViewInventoryOpen}
        >
          <WorkOrderForm
            data={workOrdersMemo[0]}
            toggle={handleModalInventoryView}
          />
        </Modal>
      ) : null}
      <Modal title="Add Work Order" toggle={toggle} isShown={isShown}>
        <WorkOrderForm toggle={toggle} />
      </Modal>
      <Modal
        title="Set OEE Threshold"
        toggle={toggleOeeForm}
        isShown={isShownOeeForm}
      >
        <OeeThresholdForm toggle={toggleOeeForm} />
      </Modal>
      <ContentWrapper id={htmlId}>
        <div
          className="relative p-1 w-full overflow-auto"
          style={{
            height: `calc(100vh - (${occupiedHeight}px)`,
          }}
        >
          <BaseTable
            data={workOrdersMemo ?? []}
            columns={columns}
            onSearchInput
            meta={dataWorkOrderMeta}
            backendPagination={
              dataWorkOrderMeta && (
                <TableBackendPagination
                  page={page}
                  take={take}
                  setPage={setPage}
                  meta={dataWorkOrderMeta}
                  setLimit={setLimit}
                />
              )
            }
            onSearchInputChange={setInputSearch}
            searchInputValue={inputSearch}
            withToolbar
            additionalPrefixToolbarElement={
              <TabSwitch
                handleViewChange={(view) => handleClickselectedViewParams(view)}
                viewParameter={selectedViewParams}
              />
            }
            renderExpansion={(row: Row<IWorkOrderResponse>) => {
              const currentWorkOrder = workOrdersMemo.find(
                (d) => d.id === row.original.id,
              );

              return isLoading ? (
                <Spinner
                  size={24}
                  isFullWidthAndHeight={false}
                  borderWidth={2.5}
                  containerClassName="p-2"
                />
              ) : (
                <ExpansionTable
                  data={currentWorkOrder ? [currentWorkOrder] : []}
                  isShowPagination={false}
                  columns={expandColumns}
                  isFullWidth
                />
              );
            }}
            isLoading={loading}
            additionalSuffixToolbarElement={
              <>
                <Button
                  className="btn-primary-green hover:hover-btn-primary-green"
                  onClick={() => toggleOeeForm()}
                >
                  Set OEE Threshold
                </Button>
                <Button
                  className="btn-primary-mint hover:hover-btn-primary-mint"
                  onClick={() => toggle()}
                >
                  Add Work Order <AiOutlinePlus className="ml-2" />
                </Button>
              </>
            }
            isFullWidth
          />
        </div>

        <Copilot />
      </ContentWrapper>
    </PageWrapper>
  );
};

export default WorkOrderPage;
