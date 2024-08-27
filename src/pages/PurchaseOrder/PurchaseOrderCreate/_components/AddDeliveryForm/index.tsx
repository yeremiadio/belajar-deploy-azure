import { useEffect, useRef, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { MdClose } from 'react-icons/md';
import dayjs from 'dayjs';
import { useSearchParams } from 'react-router-dom';

import deliveryOrderValidationSchema from '@/utils/validations/order/deliveryOrderValidationSchema';

import { TModalFormProps } from '@/types/modal';
import {
  TOrderDelivery,
  TOrderDeliveryRequestFormObject,
} from '@/types/api/order/orderDelivery';
import {
  IInventory,
  TInventoryWithAmount,
} from '@/types/api/management/inventory';
import { BackendResponse, ErrorMessageBackendDataShape } from '@/types/api';
import { TReservationActivityFormObject } from '@/types/api/reservation';

import InputComponent from '@/components/InputComponent';
import DrawerSubmitAction from '@/components/Form/DrawerSubmitAction';
import { Button } from '@/components/ui/button';
import InputDatePickerComponent from '@/components/InputDatePickerComponent';
import Checkbox from '@/components/Checkbox';
import SelectComponent from '@/components/Select';
import { useToast } from '@/components/ui/use-toast';

import {
  useCreateDeliveryOrderMutation,
  useGetDeliveryOrderByIdQuery,
  useUpdateDeliveryOrderMutation,
} from '@/stores/purchaseOrderStore/deliveryOrderApi';
import { usePostReservationMutation } from '@/stores/reservationStore/reservationStoreApi';

import generateDynamicToastMessage from '@/utils/functions/generateDynamicToastMessage';
import generateStatusCodesMessage from '@/utils/functions/generateStatusCodesMessage';
import useDriverNameOptions from '@/utils/hooks/selectOptions/useDriverNameOptions';
import useLicensePlateOptions from '@/utils/hooks/selectOptions/useLicensePlateOptions';
import useTagOptions from '@/utils/hooks/selectOptions/useTagOptions';

interface Props extends TModalFormProps<any> {
  currentInventoryList?: TInventoryWithAmount[];
  selectedDelivery?: TOrderDelivery;
  vendorId?: number;
}

const AddDeliveryForm = ({
  toggle,
  currentInventoryList,
  selectedDelivery,
  vendorId,
}: Props) => {
  const { toast } = useToast();
  const editMode = !!selectedDelivery;

  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCreateAsReservation, setIsCreateAsReservation] = useState(false);
  const [searchParams] = useSearchParams();
  const orderId = Number(searchParams.get('id'));

  const { arr: driverNameOptions, isLoading: isLoadingDriverNameOptions } =
    useDriverNameOptions({
      isAvailable: true,
    });
  const { arr: licensePlateOptions, isLoading: isLoadingLicensePlateOptions } =
    useLicensePlateOptions({ isAvailable: true });
  const { arr: tagOptions, isLoading: isLoadingTagOptions } = useTagOptions({
    isAvailable: true,
  });

  const [createDelivery] = useCreateDeliveryOrderMutation();
  const [updateDelivery] = useUpdateDeliveryOrderMutation();
  const [createReservation] = usePostReservationMutation();

  const { currentData: inventoryOrderDeliveries } =
    useGetDeliveryOrderByIdQuery(
      { id: Number(selectedDelivery?.id) },
      {
        skip: !editMode,
      },
    );

  const transformedInventoryList = currentInventoryList?.map((item) => ({
    inventoryId: item?.inventory?.id,
    amount: item?.quantity,
    inventory: item?.inventory,
  }));

  const DeliveryForm = useForm<TOrderDeliveryRequestFormObject>({
    defaultValues: {
      deliveryId: selectedDelivery?.deliveryId?.toString() ?? '',
      expectedDeliveryDate: selectedDelivery?.expectedDeliveryDate
        ? dayjs(selectedDelivery.expectedDeliveryDate).toDate()
        : undefined,
      annotation: selectedDelivery?.annotation ?? '',
      orderDeliveryItems: transformedInventoryList ?? [],
      isPriority: false,
      tagId: undefined,
      driverId: undefined,
      vehicleId: undefined,
      file: undefined,
    },
    resolver: yupResolver(deliveryOrderValidationSchema),
    mode: 'all',
    reValidateMode: 'onChange',
  });

  const { control } = DeliveryForm;
  const { fields, replace } = useFieldArray({
    control,
    name: 'orderDeliveryItems',
  });

  useEffect(() => {
    if (!editMode) return;

    const transformedSelectedInventoryList: any = selectedDelivery
      ? inventoryOrderDeliveries?.orderDeliveryItems?.map((item: any) => ({
          inventoryId: item?.inventoryId,
          amount: item?.amount,
          inventory: currentInventoryList?.find(
            (inventory) => inventory.inventory?.id === item.inventoryId,
          )?.inventory,
        }))
      : [];

    replace(transformedSelectedInventoryList);
  }, [inventoryOrderDeliveries]);

  const handleSubmit = async (data: TOrderDeliveryRequestFormObject) => {
    if (!data) return;

    if (editMode) {
      const payload: Partial<TOrderDeliveryRequestFormObject> = data;
      if (payload.deliveryId === selectedDelivery.deliveryId) {
        delete payload.deliveryId;
      }
      await updateDelivery({
        data: {
          ...payload,
          orderId,
        },
        id: selectedDelivery.id,
      })
        .unwrap()
        .then(() => {
          toggle();
          toast(
            generateDynamicToastMessage({
              title: 'Success',
              description: 'Delivery updated successfully',
              variant: 'success',
            }),
          );
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
    } else {
      await createDelivery({
        ...data,
        orderId,
      })
        .unwrap()
        .then((res: BackendResponse<{ id: number }>) => {
          toast(
            generateDynamicToastMessage({
              title: 'Success',
              description: 'Delivery created successfully',
              variant: 'success',
            }),
          );
          if (isCreateAsReservation) {
            const payload: TReservationActivityFormObject = {
              driverId: Number(data?.driverId),
              expectedCheckInDate: dayjs(data?.expectedDeliveryDate).format(
                'YYYY-MM-DD',
              ) as unknown as Date,
              licensePlateId: Number(data.vehicleId),
              reservationItems: data?.orderDeliveryItems
                ? data?.orderDeliveryItems?.map((item) => ({
                    inventoryId: item.inventoryId ?? 0,
                    amount: item.amount ?? 0,
                    unit: (item.inventory as IInventory)?.unit,
                  }))
                : [],
              tagId: Number(data.tagId),
              vendorId: vendorId ?? 0,
              category: 'OUTBOUND',
              orderDeliveryId: res.data.id,
              file: data.file,
              documentId: '', // Remove after BE changes it to optional
              isPriority: data.isPriority,
            };

            createReservation({
              ...payload,
            })
              .unwrap()
              .then(() => {
                toast(
                  generateDynamicToastMessage({
                    title: 'Success',
                    description: `Reservation added successfully`,
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
          }
          toggle();
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
    }
  };

  return (
    <form
      id="orderDeliveryForm"
      className="flex w-full flex-col gap-4"
      onSubmit={DeliveryForm.handleSubmit(handleSubmit)}
    >
      <div className="grid gap-4">
        <div className="grid grid-cols-2 items-start gap-4">
          <Controller
            name="deliveryId"
            control={control}
            render={({
              field: { onChange, value, onBlur },
              fieldState: { error },
            }) => (
              <InputComponent
                label="Delivery ID"
                placeholder="Delivery ID"
                type="text"
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                required
                errorMessage={error?.message}
              />
            )}
          />
          <Controller
            name="expectedDeliveryDate"
            control={control}
            render={({
              field: { onChange, value, onBlur },
              fieldState: { error },
            }) => (
              <InputDatePickerComponent
                label="Expected Delivery"
                placeholder="Expected Delivery Date"
                onChange={onChange}
                onBlur={onBlur}
                value={value}
                disabledCalendar={(date) =>
                  dayjs(date).isBefore(dayjs().startOf('day'))
                }
                required
                errorMessage={error?.message}
              />
            )}
          />
        </div>
        <Controller
          name="annotation"
          control={control}
          render={({ field: { onChange, value } }) => (
            <InputComponent
              label="Annotation"
              placeholder="Annotation"
              type="text"
              value={value}
              onChange={onChange}
            />
          )}
        />
        <span className="text-lg font-bold">List Inventory</span>
        <div className="flex flex-col gap-3">
          {fields.map((item, index) => (
            <div key={item.id} className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <InputComponent
                  className="!text-white"
                  label={index === 0 ? 'Inventory' : ''}
                  placeholder={`Inventory ${index + 1}`}
                  type="text"
                  value={(item.inventory as IInventory)?.name}
                  disabled
                />
              </div>
              <Controller
                control={control}
                name={`orderDeliveryItems.${index}.amount`}
                render={({ field: { onChange, value } }) => (
                  <div className="flex items-end gap-2">
                    <InputComponent
                      label={index === 0 ? 'Amount' : ''}
                      type="number"
                      value={value}
                      onChange={(e) => {
                        if (
                          e.target.valueAsNumber >
                          (currentInventoryList?.[index]?.quantity ?? 0)
                        ) {
                          onChange(
                            currentInventoryList?.[index]?.quantity ?? 0,
                          );
                        } else {
                          onChange(e.target.valueAsNumber);
                        }
                      }}
                      onBlur={(e) => {
                        const inputValue = Number(e.target.value);
                        if (inputValue < 1) {
                          onChange(0);
                        }
                      }}
                      required
                    />
                    <span className={'w-14 pb-3'}>
                      {(item.inventory as IInventory)?.unit}
                    </span>
                  </div>
                )}
              />
            </div>
          ))}
        </div>

        {!editMode && (
          <div className="flex items-start">
            <Checkbox
              label="Create As Reservation"
              onChange={() => {
                setIsCreateAsReservation(!isCreateAsReservation);
              }}
              checked={isCreateAsReservation}
            />
          </div>
        )}
      </div>

      {isCreateAsReservation && !editMode && (
        <>
          <div className="grid grid-cols-2 items-start gap-4">
            <Controller
              name="isPriority"
              control={control}
              render={({ field: { onChange, value } }) => (
                <div className="flex items-start">
                  <Checkbox
                    labelContainer="Type Reservation"
                    label="Priority"
                    onChange={onChange}
                    checked={value}
                  />
                </div>
              )}
            />
            <Controller
              name="tagId"
              control={control}
              render={({
                field: { onChange, value, onBlur },
                fieldState: { error },
              }) => {
                return (
                  <SelectComponent
                    label="RFID Tag"
                    placeholder="Select RFID Tag"
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    options={tagOptions}
                    loading={isLoadingTagOptions}
                    required
                    errorMessage={error?.message}
                  />
                );
              }}
            />
          </div>

          <div className="grid grid-cols-2 items-start gap-4">
            <Controller
              name="driverId"
              control={control}
              render={({
                field: { onChange, value, onBlur },
                fieldState: { error },
              }) => {
                return (
                  <SelectComponent
                    label="Driver"
                    placeholder="Select Driver"
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    options={driverNameOptions}
                    loading={isLoadingDriverNameOptions}
                    required
                    errorMessage={error?.message}
                  />
                );
              }}
            />
            <Controller
              name="vehicleId"
              control={control}
              render={({
                field: { onChange, value, onBlur },
                fieldState: { error },
              }) => {
                return (
                  <SelectComponent
                    label="Vehicle"
                    placeholder="Select Vehicle"
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    options={licensePlateOptions}
                    loading={isLoadingLicensePlateOptions}
                    required
                    errorMessage={error?.message}
                  />
                );
              }}
            />
          </div>
          <Controller
            name="file"
            control={control}
            render={({ field: { onChange }, fieldState: { error } }) => (
              <div className="flex flex-col">
                <span className="text-nowrap pb-2">File</span>
                <div className="inline-flex items-center">
                  <Button
                    type="button"
                    className="btn-primary-mint hover:hover-btn-primary-mint w-10"
                    role="button"
                    onClick={() => {
                      fileInputRef.current?.click();
                    }}
                  >
                    Select File
                  </Button>
                  <input
                    type="file"
                    className="hidden"
                    ref={fileInputRef}
                    accept=".doc,.docx,.xls,.xlsx,.png,.jpg"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (file.size > 10 * 1024 * 1024) {
                          // file size > 10MB
                          alert(
                            'File is too large, please select a file less than 10MB.',
                          );
                          return;
                        }
                        const acceptedFileTypes = [
                          'doc',
                          'docx',
                          'xls',
                          'xlsx',
                          'png',
                          'jpg',
                        ];
                        const fileType = file.name
                          .split('.')
                          .pop()
                          ?.toLowerCase();
                        if (
                          !fileType ||
                          !acceptedFileTypes.includes(fileType)
                        ) {
                          alert(
                            'Invalid file type. Only .doc, .docx, .xls, .xlsx, .png, .jpg files are accepted.',
                          );
                          return;
                        }
                        onChange(file);
                        setFileName(file.name || '');
                      }
                    }}
                  />
                  {fileName && (
                    <div className="ml-2 flex flex-row items-center">
                      <span className="text-xs">
                        {fileName.length > 30
                          ? fileName.slice(0, 30) + '...'
                          : fileName}
                      </span>
                      <MdClose
                        size={20}
                        className="cursor-pointer text-red-500"
                        onClick={() => {
                          setFileName('');
                          if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                          }
                          onChange(undefined);
                          DeliveryForm.formState.errors.file = {
                            type: 'required',
                            message: 'File is required',
                          };
                        }}
                      />
                    </div>
                  )}
                </div>
                <p className="pt-2 text-xs text-red-500">{error?.message}</p>
              </div>
            )}
          />
        </>
      )}

      <DrawerSubmitAction
        type="submit"
        form="orderDeliveryForm"
        disabled={
          DeliveryForm.formState.isSubmitting || !DeliveryForm.formState.isValid
        }
        toggle={toggle}
        submitText={editMode ? 'Update Delivery' : 'Add Delivery'}
      />
    </form>
  );
};

export default AddDeliveryForm;
