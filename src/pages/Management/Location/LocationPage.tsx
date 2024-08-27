import { useEffect, useMemo, useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { MdDeleteOutline } from 'react-icons/md';
import { useSearchParams } from 'react-router-dom';

import Copilot from '@/components/Copilot';
import DivPropagationWrapper from '@/components/DivPropagationWrapper';
import Modal from '@/components/Modal';
import SelectComponent from '@/components/Select';
import { BaseTable } from '@/components/Table/BaseTable';
import TableBackendPagination from '@/components/Table/BaseTable/_components/TableBackendPagination';
import TopBar from '@/components/TopBar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import ContentWrapper from '@/components/Wrapper/ContentWrapper';
import PageWrapper from '@/components/Wrapper/PageWrapper';
import { cn } from '@/lib/utils';
import { loadCookie } from '@/services/cookie';
import { setHtmlRefId } from '@/stores/htmlRefStore/htmlRefSlice';
import {
  useDeleteLocationMutation,
  useGetLocationQuery,
} from '@/stores/managementStore/locationStore/locationStoreApi';
import { ErrorMessageBackendDataShape } from '@/types/api';
import { ILocation } from '@/types/api/management/location';
import filterObjectIfValueIsEmpty from '@/utils/functions/filterObjectIfValueIsEmpty';
import generateDynamicToastMessage from '@/utils/functions/generateDynamicToastMessage';
import generateStatusCodesMessage from '@/utils/functions/generateStatusCodesMessage';
import { removeEmptyObjects } from '@/utils/functions/removeEmptyObjects';
import useUserType from '@/utils/hooks/auth/useUserType';
import useCompanyOpts from '@/utils/hooks/selectOptions/useCompanyOptions';
import useAppDispatch from '@/utils/hooks/useAppDispatch';
import useBackendPaginationController from '@/utils/hooks/useBackendPaginationController';
import { useDebounce } from '@/utils/hooks/useDebounce';
import { useModal } from '@/utils/hooks/useModal';
import { ColumnDef } from '@tanstack/react-table';

import AddPinpointForm from './_components/Forms/AddPinpointForm';
import LocationForm from './_components/Forms/LocationForm';
import formatShiftTime from './_functions/formatShiftTime';

const LocationPage = () => {
  const htmlId = 'managementLocationId';
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setHtmlRefId(htmlId));
  }, [dispatch]);

  const companyIdCookie = loadCookie('companyId');
  const { toggle, isShown } = useModal();
  const { toast } = useToast();
  const currentUserType = useUserType();

  // options
  const { arr: companyOptions, isLoading: isLoadingCompanyOptions } =
    useCompanyOpts(
      { isPaginated: false },
      {
        skip: currentUserType !== 'systemadmin',
      },
    );

  // useSearchParams
  const [searchParams, setSearchParams] = useSearchParams();
  const searchLocationParams = searchParams.get('search');
  const selectedCompanyIdParams = searchParams.get('companyId');
  const getPageParams = searchParams.get('page');
  const getTakeParams = searchParams.get('take');

  const [inputSearch, setInputSearch] = useState<string>(
    searchLocationParams ?? '',
  );
  const debouncedSearch = useDebounce(inputSearch, 1500);

  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(
    selectedCompanyIdParams ? Number(selectedCompanyIdParams) : null,
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
    } else {
      searchParams.delete('search');
    }
    setSearchParams(searchParams);
  }, [debouncedSearch]);

  useEffect(() => {
    if (selectedCompanyId) {
      searchParams.set('companyId', selectedCompanyId.toString());
      searchParams.set('page', '1');
    } else {
      searchParams.delete('companyId');
    }
    setSearchParams(searchParams);
  }, [selectedCompanyId]);

  const activeFilter = removeEmptyObjects({
    page: getPageParams ?? page,
    take: getTakeParams ?? take,
    search: debouncedSearch,
    companyId:
      currentUserType !== 'systemadmin' ? companyIdCookie : selectedCompanyId,
  });

  const {
    data: locationData,
    isLoading,
    isFetching,
  } = useGetLocationQuery(activeFilter);
  const loading = isLoading || isFetching;

  const locationDataMemo = useMemo<ILocation[]>(() => {
    if (!locationData || !locationData.entities) return [];
    const list = locationData.entities.slice();
    return list;
  }, [locationData]);

  const dataMeta = useMemo(() => {
    return locationData?.meta;
  }, [locationData]);

  const columnsMemo = useMemo<ColumnDef<ILocation>[]>(() => {
    const column: ColumnDef<ILocation>[] = [
      {
        accessorKey: 'name',
        id: 'name',
        header: 'Location',
        minSize: 400,
      },
      {
        accessorKey: 'shifts',
        id: 'shifts',
        header: 'Shift',
        minSize: 400,
        cell: ({ row }) => {
          const { shifts } = row.original;
          return (
            <div className="flex flex-wrap items-center gap-1">
              {shifts.map((shift) => {
                const formattedTimeStart = formatShiftTime(shift.start);
                const formattedTimeEnd = formatShiftTime(shift.end);
                return (
                  <div
                    key={shift.id}
                    className={cn('w-fit rounded-full px-3 py-1')}
                    style={{
                      background: '#FCBB5A4D',
                      color: '#E67E22',
                    }}
                  >
                    <p className="whitespace-nowrap">
                      {formattedTimeStart} - {formattedTimeEnd}
                    </p>
                  </div>
                );
              })}
            </div>
          );
        },
      },
      {
        accessorKey: 'coordinate',
        id: 'coordinate',
        header: 'Coordinate',
        minSize: 200,
        cell: ({ row }) => {
          const { coordinate } = row.original;
          const isCoordinateExist =
            coordinate && Object.keys(coordinate).length > 0;
          return isCoordinateExist ? (
            <p>
              {coordinate?.lat}, {coordinate?.lng}
            </p>
          ) : (
            '-'
          );
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
          const { toggle: toggleAddPinpoint, isShown: isShownAddPinpoint } =
            useModal();
          const [deleteLocation] = useDeleteLocationMutation();
          const handleDelete = async () => {
            await deleteLocation(data.id)
              .unwrap()
              .then(() => {
                toggleDelete();
                toast(
                  generateDynamicToastMessage({
                    title: 'Success',
                    description: `Location ${data.name} deleted successfully`,
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
                title="Add Pinpoint"
                onInteractOutsideDialogContent={(event) =>
                  event.preventDefault()
                }
                toggle={toggleAddPinpoint}
                isShown={isShownAddPinpoint}
              >
                <AddPinpointForm toggle={toggleAddPinpoint} data={data} />
              </Modal>
              <Modal
                title="Edit Location"
                toggle={toggleEdit}
                isShown={isShownEdit}
              >
                <LocationForm data={data} isEditing toggle={toggleEdit} />
              </Modal>
              <Modal
                title="Delete Location"
                toggle={toggleDelete}
                isShown={isShownDelete}
                description={
                  <p>
                    Deleting "{data.name}" will result in its <b>permanent</b>{' '}
                    deletion from the system, impacting all associated data
                    related to this Location.
                  </p>
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
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => {
                    toggleAddPinpoint();
                    // setTimeout(() => (document.body.style.pointerEvents = ''), 0);
                  }}
                  className="btn-primary-green hover:hover-btn-primary-green"
                >
                  Add Pinpoint
                </Button>
                <Button
                  onClick={() => {
                    toggleEdit();
                  }}
                  className="btn-secondary-navy-blue hover:hover-btn-secondary-navy-blue"
                >
                  Edit Location
                </Button>
                <div className="inline-flex">
                  <Button
                    onClick={() => toggleDelete()}
                    className="bg-transparent p-[5px] text-rs-v2-red hover:bg-rs-v2-red hover:text-white"
                  >
                    <MdDeleteOutline size={24} />
                  </Button>
                </div>
              </div>
            </DivPropagationWrapper>
          );
        },
      },
    ];
    switch (currentUserType) {
      case 'systemadmin':
        const newColumn = column.filter((item) => item.id !== 'shifts');
        newColumn.splice(1, 0, {
          accessorKey: 'company',
          id: 'company',
          header: 'Company',
          minSize: 200,
          cell: ({ row }) => row.original?.company?.name ?? '-',
        });
        return newColumn;
      default:
        return column;
    }
  }, [currentUserType]);

  return (
    <PageWrapper>
      <TopBar title="Management Location" isFloating={false} />
      <Modal title="Add Location" toggle={toggle} isShown={isShown}>
        <LocationForm toggle={toggle} />
      </Modal>
      <ContentWrapper id={htmlId}>
        <div className="w-full">
          <BaseTable
            data={locationDataMemo}
            columns={columnsMemo}
            onSearchInput
            isShowNumbering
            exportText="Export to CSV"
            exportName="location"
            onExportButton
            meta={dataMeta}
            onSearchInputChange={setInputSearch}
            searchInputValue={inputSearch}
            withToolbar
            additionalPrefixToolbarElement={
              currentUserType === 'systemadmin' ? (
                <SelectComponent
                  allowClear
                  options={companyOptions}
                  value={selectedCompanyId}
                  containerClassName="w-fit"
                  className="rc-select--navy-blue"
                  placeholder="Search Company..."
                  loading={isLoadingCompanyOptions}
                  onChange={(value) => setSelectedCompanyId(value)}
                  labelRender={({ label }) => (
                    <p className="max-w-32 overflow-hidden text-ellipsis whitespace-nowrap">
                      {label}
                    </p>
                  )}
                />
              ) : (
                <></>
              )
            }
            backendPagination={
              dataMeta ? (
                <TableBackendPagination
                  page={page}
                  take={take}
                  setPage={setPage}
                  meta={dataMeta}
                  setLimit={setLimit}
                />
              ) : (
                <></>
              )
            }
            additionalSuffixToolbarElement={
              <Button
                className="btn-primary-mint hover:hover-btn-primary-mint"
                onClick={() => toggle()}
              >
                Add Location <AiOutlinePlus className="ml-2" />
              </Button>
            }
            isFullWidth
            isLoading={loading}
          />
        </div>

        <Copilot />
      </ContentWrapper>
    </PageWrapper>
  );
};

export default LocationPage;
