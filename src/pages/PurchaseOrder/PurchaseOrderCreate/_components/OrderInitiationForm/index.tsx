import { useEffect } from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import dayjs from 'dayjs';

import useVendorOptions from '@/utils/hooks/selectOptions/useVendorOptions';
import useOrderStatusOptions from '@/utils/hooks/selectOptions/useOrderStatusOptions';
import useOrderTermsOptions from '@/utils/hooks/selectOptions/useOrderTermsOptions';
import useInventoryGroupOptions from '@/utils/hooks/selectOptions/useInventoryGroupOptions';

import { resetOrder } from '@/stores/purchaseOrderStore/purchaseOrderSlice';
import { useGetPurchaseOrderByIdQuery } from '@/stores/purchaseOrderStore/purchaseOrderApi';
import { useGetDeliveryOrderQuery } from '@/stores/purchaseOrderStore/deliveryOrderApi';

import {
  OrderStatusEnum,
  TPurchaseOrderRequestFormObject,
} from '@/types/api/order';

import Card from '@/components/Card';
import InputDatePickerComponent from '@/components/InputDatePickerComponent';
import InputTextareaComponent from '@/components/InputTextAreaComponent';
import SelectComponent from '@/components/Select';
import getStatusPermissions from '@/utils/functions/order/getStatusPermissions';

type Props = {
  orderFormObject: UseFormReturn<TPurchaseOrderRequestFormObject>;
  orderId?: string;
};

const OrderInitiationForm = ({ orderFormObject, orderId }: Props) => {
  const { control, watch, setValue } = orderFormObject;
  const dispatch = useDispatch();

  const { data: orderData } = useGetPurchaseOrderByIdQuery(
    {
      id: Number(orderId),
    },
    {
      skip: !orderId,
    },
  );

  const { data: deliveryData } = useGetDeliveryOrderQuery({
    page: 1,
    take: 10,
  });

  const permissions = getStatusPermissions(
    orderData?.status as OrderStatusEnum,
  );

  const { arr: vendorOptions } = useVendorOptions({});
  const { data: inventoryGroupOpt } = useInventoryGroupOptions();
  const { data: orderStatusOpt } = useOrderStatusOptions();
  const { data: orderTermsOpt } = useOrderTermsOptions();

  const orderDeliveryExists =
    deliveryData?.entities && deliveryData?.entities?.length > 0;
  const filteredOrderStatusOpt = orderDeliveryExists
    ? orderStatusOpt
    : orderStatusOpt.filter((status) => status.value !== 'COMPLETE');

  useEffect(() => {
    if (watch('vendorId')) {
      const selectedVendor = vendorOptions.find(
        (vendor) => vendor.value === watch('vendorId'),
      );

      setValue('address', selectedVendor?.address || '');
    }
  }, [watch('vendorId')]);

  return (
    <Card className="relative box-border h-fit overflow-visible p-6">
      <div className="grid grid-cols-1 gap-0 lg:grid-cols-2 lg:gap-24">
        <div>
          <div className="mb-4 flex gap-6">
            <p className="mt-2 w-32">
              Vendor<span className="text-red-500">*</span>
            </p>
            <Controller
              name="vendorId"
              control={control}
              render={({
                field: { onChange, value, onBlur },
                fieldState: { error },
              }) => {
                return (
                  <SelectComponent
                    id="vendorSelect"
                    placeholder="Select Vendor"
                    onChange={(e) => {
                      onChange(e);
                    }}
                    onBlur={onBlur}
                    label=""
                    value={value}
                    options={vendorOptions}
                    loading={false}
                    disabled={!permissions.canChangeVendor.vendor}
                    required
                    errorMessage={error?.message}
                    popupContainer="body"
                  />
                );
              }}
            />
          </div>
          <div className="mb-4 flex gap-6">
            <p className="mt-2 w-32">Address</p>
            <Controller
              name="address"
              control={control}
              render={({ field: { onChange, value, onBlur } }) => (
                <InputTextareaComponent
                  placeholder="Address"
                  onChange={onChange}
                  onBlur={onBlur}
                  label=""
                  value={value}
                  disabled={!permissions.canChangeVendor.address}
                />
              )}
            />
          </div>
        </div>

        <div>
          <div className="mb-4 flex gap-6">
            <p className="mt-2 w-32">
              Pricelist<span className="text-red-500">*</span>
            </p>
            <Controller
              name="groupInventoryId"
              control={control}
              render={({
                field: { onChange, value, onBlur },
                fieldState: { error },
              }) => {
                const selectedOption = inventoryGroupOpt.find(
                  (option) => option.value === value,
                );
                const displayValue = selectedOption
                  ? selectedOption.label
                  : orderId
                    ? '-'
                    : undefined;

                return (
                  <SelectComponent
                    id="pricelistSelect"
                    placeholder="Select Pricelist"
                    onChange={(e) => {
                      onChange(e);
                      setValue('inventoryList', []);
                      dispatch(resetOrder());
                    }}
                    onBlur={onBlur}
                    label=""
                    value={displayValue}
                    options={inventoryGroupOpt}
                    loading={false}
                    disabled={!permissions.canChangeVendor.pricelist}
                    required
                    errorMessage={error?.message}
                    popupContainer="body"
                  />
                );
              }}
            />
          </div>
          <div className="mb-4 flex gap-6">
            <p className="mt-2 w-32">
              Delivery Date<span className="text-red-500">*</span>
            </p>
            <Controller
              name="deliveryDate"
              control={control}
              render={({
                field: { onChange, value, onBlur },
                fieldState: { error },
              }) => {
                return (
                  <InputDatePickerComponent
                    placeholder="Select Date"
                    onChange={onChange}
                    onBlur={onBlur}
                    label=""
                    value={value}
                    disabledCalendar={(date) =>
                      dayjs(date).isBefore(dayjs().startOf('day'))
                    }
                    disabled={!permissions.canChangeVendor.deliveryDate}
                    required
                    errorMessage={error?.message}
                  />
                );
              }}
            />
          </div>
          <div className="mb-4 flex gap-6">
            <p className="mt-2 w-32">
              Terms<span className="text-red-500">*</span>
            </p>
            <Controller
              name="termsId"
              control={control}
              render={({
                field: { onChange, value, onBlur },
                fieldState: { error },
              }) => {
                return (
                  <SelectComponent
                    id="termsSelect"
                    placeholder="Select Terms"
                    onChange={onChange}
                    onBlur={onBlur}
                    label=""
                    value={value}
                    options={orderTermsOpt}
                    loading={false}
                    disabled={!permissions.canChangeVendor.terms}
                    required
                    errorMessage={error?.message}
                    popupContainer="body"
                  />
                );
              }}
            />
          </div>
          <div className="flex gap-6">
            <p className="mt-2 w-32">
              Status<span className="text-red-500">*</span>
            </p>
            <Controller
              name="status"
              control={control}
              render={({
                field: { onChange, value, onBlur },
                fieldState: { error },
              }) => {
                return (
                  <SelectComponent
                    id="statusSelect"
                    placeholder="Select Status"
                    onChange={onChange}
                    onBlur={onBlur}
                    label=""
                    value={value}
                    options={filteredOrderStatusOpt}
                    loading={false}
                    disabled={!permissions.canChangeVendor.status}
                    required
                    errorMessage={error?.message}
                    popupContainer="body"
                  />
                );
              }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default OrderInitiationForm;
