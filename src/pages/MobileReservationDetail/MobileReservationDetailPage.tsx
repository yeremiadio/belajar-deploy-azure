import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { Controller, SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { FaRegArrowAltCircleRight } from 'react-icons/fa';
import { FaBuilding } from 'react-icons/fa6';
import { useNavigate, useParams } from 'react-router-dom';

import { IconArrowSmall } from '@/assets/images/ArrowSmall';
import { IconStar } from '@/assets/images/Star';
import { ModalMobile } from '@/components/ModalMobile';
import { Button } from '@/components/ui/button';
import { DrawerClose, DrawerFooter } from '@/components/ui/drawer';
import { cn } from '@/lib/utils';
import { setHtmlRefId } from '@/stores/htmlRefStore/htmlRefSlice';
import {
  useGetReservationByIdQuery,
  useUpdateReservationMutation,
} from '@/stores/reservationStore/reservationStoreApi';
import {
  ReservationActivityStatusEnum,
  TReservationActivityFormObject,
  TReservationObject,
} from '@/types/api/reservation';
import { ROUTES } from '@/utils/configs/route';
import useAppDispatch from '@/utils/hooks/useAppDispatch';
import { useModal } from '@/utils/hooks/useModal';

import { LoadingSection } from './_components/LoadingSection';
import { TableInventory } from './_components/TableInventory';
import { ErrorMessageBackendDataShape } from '@/types/api';
import generateStatusCodesMessage from '@/utils/functions/generateStatusCodesMessage';
import { toast } from '@/components/ui/use-toast';
import generateDynamicToastMessage from '@/utils/functions/generateDynamicToastMessage';
import { FormLocation } from './_components/FormLocation';
import SelectComponent from '@/components/Select';
import { BasicSelectOpt } from '@/types/global';
import { FormInventory } from './_components/FormInventory';
import { ReservationDetailIcon } from '@/assets/images';
import NotFoundCard from '../ErrorPage/_component/NotFoundCard';

export default function MobileReservationDetailPage() {
  const htmlId = 'mobileReservationDetailId';
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setHtmlRefId(htmlId));
  }, [dispatch]);

  const { toggle: toggleBack, isShown: isShownBack } = useModal();
  const navigate = useNavigate();

  const { reservationId } = useParams<'reservationId'>();
  const {
    data: reservationDetail,
    isFetching,
    isLoading,
  } = useGetReservationByIdQuery({ id: Number(reservationId) }, { skip: !reservationId });
  const loading = isFetching || isLoading;

  const reservationDetailMemo: TReservationObject | undefined = useMemo(() => {
    if (!reservationDetail) return undefined;

    const data = { ...reservationDetail };
    return data;
  }, [reservationDetail]);

  const textButton: string = useMemo(() => {
    if (!reservationDetailMemo?.status) return '';

    switch (reservationDetailMemo?.status) {
      case ReservationActivityStatusEnum.SCHEDULED:
        return 'CHECKIN';
      case ReservationActivityStatusEnum.CHECKEDIN:
        return 'UPDATE DOCKING';
      case ReservationActivityStatusEnum.WAITING:
        return 'UPDATE DOCKING';
      case ReservationActivityStatusEnum.DOCKING:
        return 'CONFIRM & CHECKOUT';
      default:
        return '';
    }
  }, [reservationDetailMemo?.status]);

  // loading section
  const [showLoadingSection, setShowLoadingSection] = useState<boolean>(false);
  const handleLoading = () => {
    setShowLoadingSection(true);

    // Set a timer to hide the content after 3 seconds
    setTimeout(() => {
      setShowLoadingSection(false);
    }, 3000);
  };

  const [updateReservation, { isLoading: isUpdatingReservation }] =
    useUpdateReservationMutation();

  const { control, handleSubmit, setValue, resetField } =
    useForm<TReservationActivityFormObject>({
      // resolver: yupResolver(reservationActivityValidationSchema),
    });
  const values = useWatch({ control });

  useEffect(() => {
    if (!reservationDetailMemo) return;
    setValue('warehouseId', reservationDetailMemo?.dock?.location?.id); // CHECKED_IN & WAITING
    setValue('dockId', reservationDetailMemo?.dock?.id); // CHECKED_IN & WAITING
    setValue('status', reservationDetailMemo?.status); // WAITING
    setValue(
      'reservationItems',
      reservationDetailMemo?.reservationItems
        ?.filter((item) => item.id)
        .map((item) => {
          return {
            inventoryId: item.inventoryId,
            amount: item.amount,
            unit: item.unit,
            actualAmount: item.actualAmount,
            stock:item.inventory.stock
          };
        }),
    ); // DOCKING
  }, [reservationDetailMemo]);

  const checkedInValidation =
    reservationDetailMemo?.status === ReservationActivityStatusEnum.CHECKEDIN &&
    (!values?.warehouseId || !values?.dockId);

  const waitingValidation =
    reservationDetailMemo?.status === ReservationActivityStatusEnum.WAITING &&
    (!values?.warehouseId || !values?.dockId);

  const dockingValidation =
    reservationDetailMemo?.status === ReservationActivityStatusEnum.DOCKING &&
    values.reservationItems &&
    !values.reservationItems?.every(
      (item) =>
        item.actualAmount && Number(item.actualAmount) <= Number(item.stock),
    );

  const handleSubmitData: SubmitHandler<
    TReservationActivityFormObject
  > = async (formData, event) => {
    event?.preventDefault();

    const getStatus = () => {
      switch (reservationDetailMemo?.status) {
        case ReservationActivityStatusEnum.SCHEDULED:
          return ReservationActivityStatusEnum.CHECKEDIN;
        case ReservationActivityStatusEnum.CHECKEDIN:
          return ReservationActivityStatusEnum.WAITING;
        case ReservationActivityStatusEnum.WAITING:
          /**
           * @description if status WAITING, user can choose to update status [WAITING | DOCKING]
           */
          return formData.status;
        case ReservationActivityStatusEnum.DOCKING:
          return ReservationActivityStatusEnum.CHECKEDOUT;
      }
    };

    if (!reservationId) return;
    await updateReservation({
      id: Number(reservationId),
      data: {
        ...formData,
        status: getStatus(),
      },
    })
      .unwrap()
      .then(() => {
        toast(
          generateDynamicToastMessage({
            title: 'Success',
            description: 'Reservation updated successfully',
            variant: 'success',
          }),
        );
        handleLoading();
      })
      .catch((error: ErrorMessageBackendDataShape) => {
        const { title, message } = generateStatusCodesMessage(error.status);
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
    !loading &&
    (reservationDetailMemo ? (
      <>
        {/* back modal */}
        <ModalMobile
          title="Are you sure want to go back ?"
          toggle={toggleBack}
          isShown={isShownBack}
          description={`This action will result in any unsaved changes being lost`}
        >
          <DrawerFooter className="flex flex-row justify-end gap-4 pb-0 pt-2">
            <DrawerClose asChild>
              <Button className="btn-terinary-gray hover:hover-btn-terinary-gray">
                Cancel
              </Button>
            </DrawerClose>
            <DrawerClose asChild>
              <Button
                onClick={() => {
                  navigate(ROUTES.mobileReservation);
                }}
                className="btn-primary-danger hover:hover-btn-primary-danger disabled:disabled-btn-disabled-slate-blue"
              >
                Yes, Go Back
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </ModalMobile>

        {showLoadingSection && <LoadingSection />}

        <div
          className={cn(
            'box-border flex flex-col gap-5 overflow-hidden',
            reservationDetailMemo?.status ===
              ReservationActivityStatusEnum.SCHEDULED && 'pb-20',
            reservationDetailMemo?.status ===
              ReservationActivityStatusEnum.CHECKEDIN && 'pb-20',
            reservationDetailMemo?.status ===
              ReservationActivityStatusEnum.WAITING && 'pb-36',
            reservationDetailMemo?.status ===
              ReservationActivityStatusEnum.DOCKING && 'pb-20',
          )}
          style={{
            height: `calc(100vh - 40px)`,
          }}
        >
          <div className="relative flex items-center justify-center gap-2">
            <IconArrowSmall
              className="h4 absolute left-0 top-[6px] w-4 -rotate-[135deg] cursor-pointer text-white"
              onClick={(e) => {
                e.preventDefault();
                toggleBack();
              }}
            />
            <h1 className="text-base font-medium text-white">
              Reservation Detail
            </h1>
          </div>

          {/* card-detail */}
          <div className="box-border flex h-fit min-h-[180px] flex-col justify-center gap-2 overflow-hidden rounded-xl border-2 border-rs-v2-thunder-blue bg-rs-v2-navy-blue p-5">
            <div className="relative flex w-full gap-3">
              <div className="box-border flex h-14 w-14 flex-col items-center justify-center overflow-hidden rounded-lg bg-rs-v2-slate-blue-60% p-4">
                <img src={ReservationDetailIcon} alt="Reservation Icon" />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1 text-rs-neutral-gray-gull">
                  <FaBuilding className="h-3 w-3" />
                  <span className="text-[10px] font-medium">
                    {reservationDetailMemo?.vendor?.name ?? '-'}
                  </span>
                </div>
                <h1 className="text-base font-semibold text-white">
                  {reservationDetailMemo?.orderDelivery?.id ?? '-'}
                </h1>
                <div className="flex items-center gap-1 text-sm font-medium text-rs-neutral-chromium">
                  <h3>{reservationDetailMemo?.driver?.name ?? '-'}</h3>
                  <div className="h-1 w-1 rounded-full bg-rs-neutral-chromium"></div>
                  <h3>{reservationDetailMemo?.licensePlate?.plate ?? '-'}</h3>
                </div>
              </div>
              {reservationDetailMemo?.isPriority && (
                <IconStar className="absolute right-0 top-0 h-6 w-6 text-rs-alert-yellow" />
              )}
            </div>

            <hr className="my-4 w-full border border-rs-v2-thunder-blue" />

            <div className="flex items-center justify-between">
              <div>
                <p className="text-[8px] font-medium text-rs-neutral-chromium">
                  Expected Checkin
                </p>
                <p className="mt-1 text-xs font-medium text-white">
                  {reservationDetailMemo?.expectedCheckInDate
                    ? dayjs(reservationDetailMemo?.expectedCheckInDate).format(
                        'DD MMM, YYYY',
                      )
                    : '-'}
                </p>
              </div>

              {reservationDetailMemo?.category && (
                <div
                  className={cn(
                    'flex items-center justify-center gap-2 rounded-full px-4 py-1 text-center',
                    reservationDetailMemo?.category === 'OUTBOUND'
                      ? 'bg-[#6d7a54] text-[#e5fc5a]'
                      : 'bg-[#426185] text-[#5aaefc]',
                  )}
                >
                  <span className="text-sm font-normal">
                    {reservationDetailMemo?.category ?? '-'}
                  </span>
                  <FaRegArrowAltCircleRight
                    className={cn(
                      'h-5 w-5 -rotate-45',
                      reservationDetailMemo?.category !== 'OUTBOUND' &&
                        'rotate-[135deg]',
                    )}
                  />
                </div>
              )}
            </div>
          </div>

          {/* status */}
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-rs-neutral-chromium">Status</span>
            <span
              className={cn(
                'font-semibold',
                reservationDetailMemo?.status ===
                  ReservationActivityStatusEnum.SCHEDULED &&
                  'text-rs-neutral-gray-gull',
                reservationDetailMemo?.status ===
                  ReservationActivityStatusEnum.CHECKEDIN &&
                  'text-rs-azure-blue',
                reservationDetailMemo?.status ===
                  ReservationActivityStatusEnum.WAITING &&
                  'text-rs-alert-yellow',
                reservationDetailMemo?.status ===
                  ReservationActivityStatusEnum.DOCKING &&
                  'text-rs-alert-green',
                reservationDetailMemo?.status ===
                  ReservationActivityStatusEnum.CHECKEDOUT &&
                  'text-rs-alert-danger',
              )}
            >
              {reservationDetailMemo?.status
                ? reservationDetailMemo?.status.replace('_', ' ')
                : '-'}
            </span>
          </div>

          {/* dock */}
          {(reservationDetailMemo?.status ===
            ReservationActivityStatusEnum.DOCKING ||
            reservationDetailMemo?.status ===
              ReservationActivityStatusEnum.CHECKEDOUT) && (
            <div className="flex items-center justify-center rounded-lg border border-[#78F3E5] bg-[#78F3E54D] p-2">
              <span className="text-xs font-semibold text-[#78F3E5]">
                {reservationDetailMemo?.dock?.location?.name ?? '-'} -{' '}
                {reservationDetailMemo?.dock?.name ?? '-'}
              </span>
            </div>
          )}

          <hr className="w-full border border-rs-v2-thunder-blue" />

          {/* reservation item */}
          <p className="text-xs font-medium text-white">List Inventory</p>
          <div className="-mt-3 overflow-y-auto">
            {reservationDetailMemo?.status !==
            ReservationActivityStatusEnum.DOCKING ? (
              <TableInventory
                reservationItem={reservationDetailMemo?.reservationItems ?? []}
              />
            ) : (
              <FormInventory
                control={control}
                data={reservationDetailMemo?.reservationItems ?? []}
              />
            )}
          </div>

          {/* form location */}
          {(reservationDetailMemo?.status ===
            ReservationActivityStatusEnum.CHECKEDIN ||
            reservationDetailMemo?.status ===
              ReservationActivityStatusEnum.WAITING) && (
            <FormLocation control={control} resetField={resetField} />
          )}

          {/* button */}
          {reservationDetailMemo?.status !==
            ReservationActivityStatusEnum.CHECKEDOUT && (
            <div className="fixed bottom-0 left-1/2 flex w-full max-w-[480px] -translate-x-1/2 flex-col gap-5 bg-rs-v2-navy-blue p-5">
              {reservationDetailMemo?.status ===
                ReservationActivityStatusEnum.WAITING && (
                <Controller
                  name="status"
                  control={control}
                  render={({
                    field: { onChange, value, onBlur },
                    fieldState: { error },
                  }) => {
                    return (
                      <SelectComponent
                        label="Status"
                        placeholder="Select Status"
                        options={
                          [
                            {
                              label: ReservationActivityStatusEnum.WAITING,
                              value: ReservationActivityStatusEnum.WAITING,
                            },
                            {
                              label: ReservationActivityStatusEnum.DOCKING,
                              value: ReservationActivityStatusEnum.DOCKING,
                            },
                          ] as BasicSelectOpt<string>[]
                        }
                        loading={false}
                        onChange={onChange}
                        onBlur={onBlur}
                        value={value}
                        required
                        errorMessage={error?.message}
                        containerClassName={'flex'}
                        labelClassName={'w-[120px]'}
                      />
                    );
                  }}
                />
              )}

              <Button
                className={cn(
                  'w-full cursor-pointer rounded-xl bg-rs-v2-mint py-4  text-black disabled:cursor-default disabled:bg-rs-v2-slate-blue-60% disabled:text-rs-neutral-chromium',
                  isUpdatingReservation && 'cursor-progress opacity-80',
                )}
                onClick={handleSubmit(handleSubmitData)}
                disabled={
                  isUpdatingReservation ||
                  checkedInValidation ||
                  waitingValidation ||
                  dockingValidation
                }
              >
                <span className="text-sm font-semibold">{textButton}</span>
              </Button>
            </div>
          )}
        </div>
      </>
    ) : (
      <div className={`flex flex-row gap-5 bg-cover bg-fixed bg-no-repeat p-4`}>
        <NotFoundCard />
      </div>
    ))
  );
}
