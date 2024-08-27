import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { useParams, useSearchParams } from 'react-router-dom';

import { AnAuthorized } from '@/assets/images';
import { IconStar } from '@/assets/images/Star';
import Checkbox from '@/components/Checkbox';
import Datetime from '@/components/TopBar/_components/Datetime';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { setHtmlRefId } from '@/stores/htmlRefStore/htmlRefSlice';
import {
  useGetReservationByIdQuery,
} from '@/stores/reservationStore/reservationStoreApi';
import {
  DeliveryStatusEnum,
  TOrderDeliveryRequestFormObject,
} from '@/types/api/order/orderDelivery';
import { TReservationObject } from '@/types/api/reservation';
import useAppDispatch from '@/utils/hooks/useAppDispatch';

import { FormOrderDelivery } from './_components/FormOrderDelivery';
import { TableInventory } from './_components/TableInventory';
import { useUpdateDeliveryOrderMutation } from '@/stores/purchaseOrderStore/deliveryOrderApi';
import { toast } from '@/components/ui/use-toast';
import generateDynamicToastMessage from '@/utils/functions/generateDynamicToastMessage';
import { ErrorMessageBackendDataShape } from '@/types/api';
import generateStatusCodesMessage from '@/utils/functions/generateStatusCodesMessage';
import { SuccessSection } from './_components/SuccessSection';

export default function MobileReservationConfirmPage() {
  const htmlId = 'mobileReservationConfirmId';
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setHtmlRefId(htmlId));
  }, [dispatch]);

  const { reservationId } = useParams<'reservationId'>();
  // useSearchParams
  const [searchParams] = useSearchParams();
  const tokenParams = searchParams.get('token');

  const {
    data: reservationDetail,
    isFetching,
    isLoading,
  } = useGetReservationByIdQuery(
    { id: Number(reservationId), token: tokenParams ?? '' },
    { skip: !reservationId && !tokenParams },
  );
  const loading = isFetching || isLoading;

  const reservationDetailMemo: TReservationObject | undefined = useMemo(() => {
    if (!reservationDetail) return undefined;

    const data = { ...reservationDetail };
    return data;
  }, [reservationDetail]);

  // success section
  const [showSuccessSection, setShowSuccessSection] = useState<boolean>(false);
  useEffect(() => {
    if (!reservationDetailMemo || !reservationDetailMemo?.orderDelivery) return;
    if (
      reservationDetailMemo.orderDelivery.status ===
        DeliveryStatusEnum.CONFIRMED ||
      reservationDetailMemo.orderDelivery.status ===
        DeliveryStatusEnum.NOT_RECEIVED
    )
      setShowSuccessSection(true);
  }, [reservationDetailMemo]);

  const [checkedConfirm, setCheckedConfirm] = useState<boolean>(false);

  const [updateDelivery, { isLoading: isUpdatingDelivery }] =
    useUpdateDeliveryOrderMutation();

  const { control, handleSubmit, formState, setValue } =
    useForm<TOrderDeliveryRequestFormObject>({
      // resolver: yupResolver(TOrderDeliveryRequestFormObject),
    });
  const values = useWatch({ control });

  useEffect(() => {
    if (!reservationDetailMemo || !reservationDetailMemo?.orderDelivery) return;
    setValue('status', reservationDetailMemo?.orderDelivery?.status ?? '');
  }, [reservationDetailMemo]);

  const scheduledValidation =
    reservationDetailMemo?.orderDelivery?.status ===
      DeliveryStatusEnum.DELIVERED &&
    (!values?.status ||
      (values.status && values.status === DeliveryStatusEnum.DELIVERED) ||
      !values?.file);

  const handleSubmitData: SubmitHandler<
    TOrderDeliveryRequestFormObject
  > = async (formData, event) => {
    event?.preventDefault();

    if (!reservationDetailMemo?.orderDelivery.id || !tokenParams) return;
    await updateDelivery({
      id: reservationDetailMemo?.orderDelivery.id,
      token: tokenParams,
      data: { ...formData, orderId: reservationDetailMemo?.orderDelivery.id },
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
        setShowSuccessSection(true);
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
        {showSuccessSection && <SuccessSection />}
        <div
          className={cn('box-border flex flex-col gap-5 overflow-hidden pb-28')}
          style={{
            height: `calc(100vh - 40px)`,
          }}
        >
          {/* card-detail */}
          <div className="relative box-border flex h-fit min-h-[300px] flex-col gap-3 overflow-hidden rounded-xl border-2 border-rs-v2-thunder-blue bg-rs-v2-navy-blue p-5">
            {reservationDetailMemo?.isPriority && (
              <IconStar className="absolute right-3 top-3 h-6 w-6 text-rs-alert-yellow" />
            )}
            <h1 className="text-center text-lg font-medium text-white">
              Reservation Detail
            </h1>

            <div>
              <h4 className="text-xs font-medium text-rs-neutral-chromium">
                Vendor
              </h4>
              <h3 className="text-base font-medium text-white">
                {reservationDetailMemo?.vendor?.name ?? '-'}
              </h3>
            </div>

            <div>
              <h4 className="text-xs font-medium text-rs-neutral-chromium">
                Delivery Order
              </h4>
              <h3 className="text-base font-medium text-white">
                {reservationDetailMemo?.orderDelivery?.id ?? '-'}
              </h3>
            </div>

            <div>
              <h4 className="text-xs font-medium text-rs-neutral-chromium">
                Driver Name
              </h4>
              <h3 className="text-base font-medium text-white">
                {reservationDetailMemo?.driver?.name ?? '-'}
              </h3>
            </div>

            <div>
              <h4 className="text-xs font-medium text-rs-neutral-chromium">
                Plate Number
              </h4>
              <h3 className="text-base font-medium text-white">
                {reservationDetailMemo?.licensePlate?.plate ?? '-'}
              </h3>
            </div>

            <hr className="w-full border border-rs-v2-thunder-blue" />

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-rs-neutral-chromium">
                  Checkin
                </p>
                <p className="text-base font-medium text-white">
                  {reservationDetailMemo?.expectedCheckInDate
                    ? dayjs(reservationDetailMemo?.expectedCheckInDate).format(
                        'DD MMM, YYYY',
                      )
                    : '-'}
                </p>
              </div>

              {reservationDetailMemo?.status && (
                <div
                  className={cn(
                    'flex items-center justify-center gap-2 rounded-full bg-white/20 px-4 py-1 text-center',
                  )}
                >
                  <span className="text-xs font-medium text-rs-neutral-chromium">
                    {reservationDetailMemo?.status
                      ? reservationDetailMemo?.status.replace('_', ' ')
                      : '-'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* reservation item */}
          <p className="text-xs font-medium text-white">List Inventory</p>
          <div className="-mt-3 overflow-y-auto">
            <TableInventory
              reservationItem={reservationDetailMemo?.reservationItems ?? []}
            />
          </div>

          {/* form delivery order */}
          <FormOrderDelivery control={control} formState={formState} />

          {/* button */}
          {reservationDetailMemo?.orderDelivery?.status ===
            DeliveryStatusEnum.DELIVERED && (
            <div className="fixed bottom-0 left-1/2 flex w-full max-w-[480px] -translate-x-1/2 flex-col gap-5 bg-rs-v2-navy-blue p-5">
              <div className="flex flex-col items-start">
                <Checkbox
                  label="Confirm that the information I have provided is accurate and complete."
                  textStyle="text-sm font-normal text-rs-neutral-chromium"
                  checked={checkedConfirm}
                  onChange={() => {
                    setCheckedConfirm(!checkedConfirm);
                  }}
                />
              </div>

              <Button
                className={cn(
                  'w-full cursor-pointer rounded-xl bg-rs-v2-mint py-4 text-black disabled:cursor-default disabled:bg-rs-v2-slate-blue-60% disabled:text-rs-neutral-chromium',
                  isUpdatingDelivery && 'cursor-progress opacity-80',
                )}
                onClick={handleSubmit(handleSubmitData)}
                disabled={
                  isUpdatingDelivery || !checkedConfirm || scheduledValidation
                }
              >
                <span className="text-sm font-semibold">CONFIRM DELIVERY</span>
              </Button>
            </div>
          )}
        </div>
      </>
    ) : (
      <div className={`flex flex-row gap-5 bg-cover bg-fixed bg-no-repeat p-4`}>
        <div className="flex h-full w-full flex-col px-3 py-3">
          <div className="ml-auto">
            {' '}
            <Datetime />
          </div>
          <div className="flex min-h-[80vh] flex-row flex-wrap items-center justify-center overflow-hidden">
            <div className="font-plus-jakarta-sans relative flex flex-col items-center justify-center">
              <img src={AnAuthorized} alt="copilot" width={300} height={300} />
              <p className="right-50 absolute top-[90px] text-6xl font-bold">
                404
              </p>
              <p className="absolute text-center text-xl uppercase">
                Page not found
              </p>
            </div>
          </div>
        </div>
      </div>
    ))
  );
}
