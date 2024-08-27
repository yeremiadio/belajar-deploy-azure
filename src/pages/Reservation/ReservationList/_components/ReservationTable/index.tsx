import { FC, useEffect, useMemo, useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import {
  MdDeleteOutline,
  MdOutlineEdit,
  // MdOutlineInfo
} from 'react-icons/md';
import { useSearchParams } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { RiArrowRightUpLine, RiArrowLeftDownLine } from 'react-icons/ri';
import {
  MdOutlineRemoveRedEye,
  MdOutlineStarBorder,
  MdOutlineStar,
} from 'react-icons/md';
import dayjs from 'dayjs';

import { cn } from '@/lib/utils';

import {
  ReservationActivityStatusEnum,
  // TReservationItem,
  TReservationObject,
} from '@/types/api/reservation';
import { ErrorMessageBackendDataShape } from '@/types/api';

import { useDebounce } from '@/utils/hooks/useDebounce';
import { useModal } from '@/utils/hooks/useModal';
import useAppDispatch from '@/utils/hooks/useAppDispatch';
import { removeEmptyObjects } from '@/utils/functions/removeEmptyObjects';
import useBackendPaginationController from '@/utils/hooks/useBackendPaginationController';
import filterObjectIfValueIsEmpty from '@/utils/functions/filterObjectIfValueIsEmpty';
import generateDynamicToastMessage from '@/utils/functions/generateDynamicToastMessage';
import generateStatusCodesMessage from '@/utils/functions/generateStatusCodesMessage';
import { useWebSocketReservation } from '@/utils/hooks/useWebSocketReservation';

import DivPropagationWrapper from '@/components/DivPropagationWrapper';
import Modal from '@/components/Modal';
import TableBackendPagination from '@/components/Table/BaseTable/_components/TableBackendPagination';
import { BaseTable } from '@/components/Table/BaseTable';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
// import {
//   HoverCard,
//   HoverCardContent,
//   HoverCardTrigger,
// } from '@/components/ui/hover-card';

import {
  useDeleteReservationMutation,
  useGetReservationQuery,
  useUpdateReservationMutation,
  updateReservationQueryData,
} from '@/stores/reservationStore/reservationStoreApi';

import ReservationForm from '@/pages/Reservation/ReservationList/_components/ReservationForm';
import ReservationDetail from '@/pages/Reservation/ReservationList/_components/ReservationDetail';

import TabSwitch from '../TabSwitch';

type Props = {
  viewParameter: string | null;
  handleClickViewParameter?: (view: 'active' | 'completed') => void;
};

const ReservationTable: FC<Props> = ({
  viewParameter,
  handleClickViewParameter,
}) => {
  const { toast } = useToast();
  const { toggle: toggleAddReservation, isShown: isShownAddReservation } =
    useModal();
  const { toggle: toggleEditReservation, isShown: isShownEditReservation } =
    useModal();
  const { toggle: toggleViewReservation, isShown: isShownViewReservation } =
    useModal();

  const [selectedReservation, setSelectedReservation] = useState<
    TReservationObject | undefined
  >();

  const [updateReservation] = useUpdateReservationMutation();

  const [searchParams, setSearchParams] = useSearchParams();
  const getSearch = searchParams.get('search');
  const getPageParams = searchParams.get('page');
  const getTakeParams = searchParams.get('take');

  const [searchValue, setSearchValue] = useState<string>(getSearch ?? '');
  const debouncedSearch = useDebounce(searchValue, 500);
  const isCompleted = viewParameter === 'completed' ? true : false;

  const dispatch = useAppDispatch();

  const { page, setPage, take, setLimit } = useBackendPaginationController(
    filterObjectIfValueIsEmpty({
      defaultPage: 1,
      defaultTake: 10,
    }),
  );

  const activeFilter = removeEmptyObjects({
    page: getPageParams ?? page,
    take: getTakeParams ?? take,
    search: debouncedSearch,
  });

  const {
    data: reservationData,
    isLoading: isLoadingReservationData,
    refetch,
  } = useGetReservationQuery({
    ...activeFilter,
    status: undefined,
    isCompleted,
  });

  const reservationDataMemo = useMemo(() => {
    if (!reservationData) {
      return [];
    }
    const data = reservationData?.entities;
    return data;
  }, [reservationData]);

  const { reservationSocket } = useWebSocketReservation();

  useEffect(() => {
    if (!reservationSocket) return;
    dispatch(
      updateReservationQueryData(
        'getReservation',
        { ...activeFilter, status: undefined, isCompleted },
        (ret) => {
          ret.entities.forEach((dev, idx, arr) => {
            if (dev.id === reservationSocket.id) {
              Object.assign(arr[idx], reservationSocket);
            }
          });
        },
      ),
    );
    refetch();
  }, [reservationSocket, refetch]);

  useEffect(() => {
    if (viewParameter) {
      searchParams.set('view', viewParameter);
    } else {
      searchParams.set('view', 'active');
    }
    searchParams.set('page', '1');
    setSearchParams(searchParams);
  }, [viewParameter]);

  useEffect(() => {
    if (debouncedSearch && debouncedSearch.length > 1) {
      searchParams.set('search', debouncedSearch);
      searchParams.set('page', '1');
    } else {
      searchParams.delete('search');
    }
    setSearchParams(searchParams);
  }, [debouncedSearch]);

  const columns: ColumnDef<TReservationObject>[] = [
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }) => {
        const data = row.original;
        const switchColorChip = useMemo((): {
          backgroundColor: string;
          textColor: string;
        } | null => {
          switch (data.status) {
            case ReservationActivityStatusEnum.WAITING:
              return {
                backgroundColor: '#FDAA094D',
                textColor: '#FDAA09',
              };
            case ReservationActivityStatusEnum.CHECKEDIN:
              return {
                backgroundColor: '#36E2D74D',
                textColor: '#36E2D7',
              };
            case ReservationActivityStatusEnum.SCHEDULED:
              return {
                backgroundColor: '#6874844D',
                textColor: '#FFFF',
              };
            case ReservationActivityStatusEnum.DOCKING:
              return {
                backgroundColor: '#20C9974D',
                textColor: '#20C997',
              };
            case ReservationActivityStatusEnum.CHECKEDOUT:
              return {
                backgroundColor: '#7B61FF4D',
                textColor: '#B5A6FF',
              };
            default:
              return null;
          }
        }, [data]);
        return (
          <div
            className={cn('w-fit rounded-full px-3 py-1')}
            style={{
              background: switchColorChip?.backgroundColor,
              color: switchColorChip?.textColor,
            }}
          >
            {data.status}
          </div>
        );
      },
    },
    {
      header: 'Category',
      cell: ({ row }) => {
        const category = row?.original?.category;
        const switchColorChip = useMemo((): {
          backgroundColor: string;
          textColor: string;
        } | null => {
          switch (category) {
            case 'OUTBOUND':
              return {
                backgroundColor: '#6d7a54',
                textColor: '#e5fc5a',
              };
            case 'INBOUND':
              return {
                backgroundColor: '#426185',
                textColor: '#5aaefc',
              };
            default:
              return null;
          }
        }, [category]);
        return (
          <div
            className={cn('flex w-fit flex-row rounded-full px-3 py-1')}
            style={{
              background: switchColorChip?.backgroundColor,
              color: switchColorChip?.textColor,
            }}
          >
            {category}
            {category === 'OUTBOUND' ? (
              <RiArrowRightUpLine className="inline-block" size={18} />
            ) : (
              <RiArrowLeftDownLine className="ml-2 inline-block" size={18} />
            )}
          </div>
        );
      },
    },
    {
      header: 'Reservation ID',
      accessorKey: 'id',
    },
    {
      header: 'Vendor',
      accessorKey: 'vendor',
      cell: ({ row }) => {
        const data = row.original;
        const priority = data?.isPriority;
        const handlePriority = () => {
          updateReservation({
            id: data.id,
            data: {
              isPriority: !priority,
            },
          });
        };

        return (
          <div className="inline-flex w-full items-center justify-between">
            <p className="text-nowrap text-white">
              {' '}
              {data?.vendor?.name ?? '-'}
            </p>

            <Button
              className="bg-transparent p-0 hover:bg-transparent"
              onClick={handlePriority}
            >
              {priority ? (
                <MdOutlineStar
                  size={20}
                  className="ml-2 text-rs-alert-warning"
                />
              ) : (
                <MdOutlineStarBorder
                  size={20}
                  className="ml-2 text-rs-v2-gunmetal-blue"
                />
              )}
            </Button>
          </div>
        );
      },
    },
    {
      header: 'License Plate',
      accessorKey: 'licensePlate',
      cell: ({ row }) => {
        const data = row.original;
        return (
          <p className="text-white">
            {' '}
            {data?.licensePlate?.plate ? data?.licensePlate?.plate : '-'}
          </p>
        );
      },
    },
    {
      header: 'Driver',
      accessorKey: 'driver',
      cell: ({ row }) => {
        const data = row.original;
        return (
          <p className="text-white">
            {' '}
            {data?.driver?.name ? data?.driver?.name : '-'}
          </p>
        );
      },
    },
    {
      header: 'Warehouse',
      accessorKey: 'dock',
      cell: ({ row }) => {
        const data = row.original;
        return (
          <p className="text-white">{data.dock?.name ? data.dock.name : '-'}</p>
        );
      },
    },
    {
      header: 'Dock No',
      accessorKey: 'dockNumber',
      cell: ({ row }) => {
        const data = row.original;
        return (
          <p className="text-white">
            {data.dockNumber ? data.dockNumber : '-'}
          </p>
        );
      },
    },
    {
      header: 'Expected Check-in',
      accessorKey: 'expectedCheckInDate',
      maxSize: 20,
      cell: ({ row }) => {
        const data = row.original;
        return (
          <p className="text-white">
            {data.expectedCheckInDate
              ? dayjs(data.expectedCheckInDate).format('DD-MM-YYYY')
              : '-'}
          </p>
        );
      },
    },
    {
      header: 'Actual Check-In',
      accessorKey: 'actualCheckInDate',
      cell: ({ row }) => {
        const data = row.original;
        return (
          <p
            className={cn(
              data.status === ReservationActivityStatusEnum.CHECKEDIN
                ? 'text-rs-v2-mint'
                : 'text-white',
            )}
          >
            {data.actualCheckInDate
              ? dayjs(data.actualCheckInDate).format('HH:mm:ss')
              : '-'}
          </p>
        );
      },
    },
    {
      header: 'Waiting',
      accessorKey: 'waitingDate',
      cell: ({ row }) => {
        const data = row.original;
        return (
          <p
            className={cn(
              data.status === ReservationActivityStatusEnum.WAITING
                ? 'text-rs-v2-mint'
                : 'text-white',
            )}
          >
            {data.waitingDate
              ? dayjs(data.waitingDate).format('HH:mm:ss')
              : '-'}
          </p>
        );
      },
    },
    {
      header: 'Docking',
      accessorKey: 'dockingDate',
      cell: ({ row }) => {
        const data = row.original;
        return (
          <p
            className={cn(
              data.status === ReservationActivityStatusEnum.DOCKING
                ? 'text-rs-v2-mint'
                : 'text-white',
            )}
          >
            {data.dockingDate
              ? dayjs(data.dockingDate).format('HH:mm:ss')
              : '-'}
          </p>
        );
      },
    },
    {
      header: 'Check-Out',
      accessorKey: 'checkOutDate',
      cell: ({ row }) => {
        const data = row.original;
        return (
          <p className="text-white">
            {data.checkOutDate
              ? dayjs(data.checkOutDate).format('HH:mm:ss')
              : '-'}
          </p>
        );
      },
    },
    // {
    //   header: 'Work ID',
    //   accessorKey: 'reservationItems',
    //   cell: ({ row }) => {
    //     const rowData = row.original;
    //     const columns: ColumnDef<TReservationItem>[] = [
    //       {
    //         accessorKey: 'id',
    //         header: 'Item ID',
    //       },
    //       {
    //         accessorKey: 'amount',
    //         header: 'Amount',
    //       },
    //       {
    //         accessorKey: 'unit',
    //         header: 'Unit',
    //         cell: ({ row }) => <p>{row.original.unit.toLocaleLowerCase()}</p>,
    //       },
    //       {
    //         accessorKey: 'item',
    //         header: 'Item',
    //         cell: ({ row }) => <p>{row.original.item.name}</p>,
    //       },
    //     ];
    //     return (
    //       <HoverCard>
    //         <HoverCardTrigger>
    //           <DivPropagationWrapper className="flex justify-between items-center gap-2 cursor-pointer">
    //             <p>{rowData.workId ? rowData.workId : '-'}</p>
    //             <Button
    //               type="button"
    //               className="bg-transparent hover:bg-rs-yale-blue p-[5px] text-rs-yale-blue hover:text-white"
    //             >
    //               <MdOutlineInfo size={24} />
    //             </Button>
    //           </DivPropagationWrapper>
    //         </HoverCardTrigger>
    //         <HoverCardContent className="bg-rs-v2-navy-blue border border-rs-v2-thunder-blue border-solid min-w-[320px]">
    //           <div className="flex justify-between space-x-4">
    //             <div className="space-y-1">
    //               <div className="flex justify-between items-center">
    //                 <h4 className="text-sm">Work ID</h4>
    //                 <h4 className="font-semibold text-rs-v2-mint text-sm">
    //                   {rowData.workId}
    //                 </h4>
    //               </div>
    //               <BaseTable
    //                 columns={columns}
    //                 isShowNumbering={false}
    //                 isShowPagination={false}
    //                 data={rowData.reservationItems}
    //                 hidePagination
    //               />
    //             </div>
    //           </div>
    //         </HoverCardContent>
    //       </HoverCard>
    //     );
    //   },
    // },
    {
      header: 'Action',
      cell: ({ row }) => {
        const data = row.original;
        const { toggle: toggleDelete, isShown: isShownDelete } = useModal();
        const [deleteReservation] = useDeleteReservationMutation();
        const handleDelete = async () => {
          await deleteReservation({ id: data.id })
            .unwrap()
            .then(() => {
              toggleDelete();
              toast(
                generateDynamicToastMessage({
                  title: 'Success',
                  description: `Reservation (id: ${data.id}) deleted successfully`,
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

        return (
          <DivPropagationWrapper>
            <Modal
              title="Delete Reservation"
              toggle={toggleDelete}
              isShown={isShownDelete}
              description={
                <span>
                  Deleting "{data.id}" will result in it's <b>permanent</b>{' '}
                  deletion from the system, impacting all associated data
                  related to this Reservation.
                </span>
              }
            >
              <div className="flex flex-row justify-end gap-4 px-0 pb-0 pt-2">
                <div>
                  <Button
                    onClick={() => toggleDelete()}
                    className="btn-terinary-gray hover:hover-btn-terinary-gray"
                  >
                    Cancel
                  </Button>
                </div>
                <div>
                  <Button
                    className="btn-primary-danger hover:hover-btn-primary-danger"
                    onClick={handleDelete}
                    type="button"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Modal>

            <div className="flex flex-row justify-center">
              <Button
                className="bg-transparent p-[5px] text-white hover:bg-rs-v2-mint hover:text-white"
                onClick={() => {
                  setSelectedReservation(data);
                  toggleViewReservation();
                }}
              >
                <MdOutlineRemoveRedEye size={24} />
              </Button>
              {data.status === ReservationActivityStatusEnum.SCHEDULED ? (
                <>
                  <Button
                    className="bg-transparent p-[5px] text-rs-baltic-blue hover:bg-rs-baltic-blue hover:text-white"
                    onClick={() => {
                      setSelectedReservation(data);
                      toggleEditReservation();
                    }}
                  >
                    <MdOutlineEdit size={24} />
                  </Button>
                  <Button
                    className="bg-transparent p-[5px] text-rs-v2-red hover:bg-rs-v2-red hover:text-white"
                    onClick={() => toggleDelete()}
                  >
                    <MdDeleteOutline size={24} />
                  </Button>
                </>
              ) : null}
            </div>
          </DivPropagationWrapper>
        );
      },
    },
  ];

  return (
    <>
      <Modal
        title="Add Reservation"
        toggle={toggleAddReservation}
        isShown={isShownAddReservation}
        // drawerDismissible={false}
        minWidth="md:min-w-[768px]"
      >
        <ReservationForm toggle={toggleAddReservation} isEditing={false} />
      </Modal>

      <Modal
        title="Edit Reservation"
        toggle={toggleEditReservation}
        isShown={isShownEditReservation}
        minWidth="md:min-w-[768px]"
      >
        <ReservationForm
          toggle={toggleEditReservation}
          isEditing={true}
          data={selectedReservation}
        />
      </Modal>

      <Modal
        title="Reservation Detail"
        toggle={toggleViewReservation}
        isShown={isShownViewReservation}
        minWidth="md:min-w-[768px]"
      >
        <ReservationDetail
          toggle={toggleViewReservation}
          data={selectedReservation}
        />
      </Modal>

      <BaseTable
        data={reservationDataMemo}
        columns={columns}
        isShowNumbering={false}
        isFullWidth
        withToolbar
        onSearchInput
        onSearchInputChange={setSearchValue}
        searchInputValue={searchValue}
        inlineSearchWithPrefix={true}
        additionalPrefixToolbarElement={
          <TabSwitch
            handleViewChange={(view) =>
              !!handleClickViewParameter && handleClickViewParameter(view)
            }
            viewParameter={viewParameter}
          />
        }
        additionalSuffixToolbarElement={
          <Button
            className="btn-primary-mint hover:hover-btn-primary-mint"
            onClick={() => toggleAddReservation()}
          >
            Add Reservation <AiOutlinePlus className="ml-2" />
          </Button>
        }
        isLoading={isLoadingReservationData}
        // onRowClick={(row) => {
        //   setSelectedReservation(row.original);
        //   toggleEditReservation();
        // }}
        meta={reservationData?.meta}
        backendPagination={
          reservationData?.meta && (
            <TableBackendPagination
              page={page}
              take={take}
              setPage={setPage}
              meta={reservationData.meta}
              setLimit={setLimit}
            />
          )
        }
      />
    </>
  );
};

export default ReservationTable;
