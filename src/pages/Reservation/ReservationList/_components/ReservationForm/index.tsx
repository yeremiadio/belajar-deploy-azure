import { useRef, useState } from 'react';
import dayjs from 'dayjs';
import QRCode from 'react-qr-code';
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form';
import { MdAdd, MdClose, MdDeleteOutline } from 'react-icons/md';

import { yupResolver } from '@hookform/resolvers/yup';

import DrawerSubmitAction from '@/components/Form/DrawerSubmitAction';
import InputComponent from '@/components/InputComponent';
import SelectComponent from '@/components/Select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import InputRadioGroup from '@/components/InputRadioGroup';
import Checkbox from '@/components/Checkbox';
import InputDatePickerComponent from '@/components/InputDatePickerComponent';

import {
  ReservationCategoryEnum,
  TReservationActivityFormObject,
  TReservationObject,
} from '@/types/api/reservation';
import { TModalFormProps } from '@/types/modal';
import { ErrorMessageBackendDataShape } from '@/types/api';

import {
  usePostReservationMutation,
  useUpdateReservationMutation,
} from '@/stores/reservationStore/reservationStoreApi';
import { useGetMetadataFileQuery } from '@/stores/fileStore/fileStoreApi';

import reservationActivityValidationSchema from '@/utils/validations/reservation/reservationActivityValidationSchema';
import useVendorOptions from '@/utils/hooks/selectOptions/useVendorOptions';
import useDriverNameOptions from '@/utils/hooks/selectOptions/useDriverNameOptions';
import useLicensePlateOptions from '@/utils/hooks/selectOptions/useLicensePlateOptions';
import useTagOptions from '@/utils/hooks/selectOptions/useTagOptions';
import generateDynamicToastMessage from '@/utils/functions/generateDynamicToastMessage';
import useInventoryOptions from '@/utils/hooks/selectOptions/useInventoryOptions';
import generateStatusCodesMessage from '@/utils/functions/generateStatusCodesMessage';
import useDeliveryOrderOptions from '@/utils/hooks/selectOptions/useDeliveryOrderOptions';
import { downloadFileWithBearerToken } from '@/utils/functions/downloadFileWithBearerToken';

import { cn } from '@/lib/utils';

const ReservationForm = ({
  toggle,
  data,
  isEditing,
}: TModalFormProps<TReservationObject | undefined>) => {
  const { toast } = useToast();

  const fileUrls = data?.fileUrls?.[0];
  const idFile = fileUrls?.split('/')[2];
  const { data: metadataFile, isLoading: loadingMetadataFile } =
    useGetMetadataFileQuery(
      {
        id: idFile ? Number(idFile) : 0,
      },
      {
        skip: !idFile,
      },
    );

  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const reservationForm = useForm({
    defaultValues: {
      documentId: data?.documentId ?? '',
      category: data?.category ?? '',
      isPriority: data?.isPriority ?? false,
      expectedCheckInDate: data?.expectedCheckInDate ?? undefined,
      vendorId: data?.vendor?.id ?? undefined,
      driverId: data?.driver?.id ?? undefined,
      licensePlateId: data?.licensePlate?.id ?? undefined,
      tagId: data?.tag?.id ?? undefined,
      isUseDeliveryOrderId: !!data?.orderDelivery ?? undefined,
      orderDeliveryId: data?.orderDelivery?.id ?? undefined,
      reservationItems: data?.reservationItems.map((item) => ({
        inventoryId: item?.inventory?.id,
        amount: item?.amount,
        unit: item?.unit,
      })) ?? [
        {
          inventoryId: undefined,
          amount: undefined,
          unit: undefined,
        },
      ],
      fileUrls: data?.fileUrls ?? [''],
    },
    resolver: yupResolver(reservationActivityValidationSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const { control, setValue, formState } = reservationForm;
  const formValues = useWatch({ control });

  const {
    fields,
    append: appendFieldArray,
    remove: removeFieldArray,
  } = useFieldArray({
    control,
    name: 'reservationItems',
  });

  const { arr: vendorOptions, isLoading: isLoadingVendorOptions } =
    useVendorOptions({});
  const { arr: driverNameOptions, isLoading: isLoadingDriverNameOptions } =
    useDriverNameOptions({
      isAvailable: true,
      excludedId: data?.driver?.id,
    });
  const { arr: licensePlateOptions, isLoading: isLoadingLicensePlateOptions } =
    useLicensePlateOptions({
      isAvailable: true,
      excludedId: data?.licensePlate?.id,
    });
  const {
    arr: deliveryOrderOptions,
    isLoading: isLoadingDeliveryOrderOptions,
  } = useDeliveryOrderOptions({});
  const { arr: tagOptions, isLoading: isLoadingTagOptions } = useTagOptions({
    isAvailable: true,
    excludedId: data?.tag?.id,
  });
  const { data: inventoryOptions } = useInventoryOptions();

  const [postReservation, { isLoading: isSubmitting }] =
    usePostReservationMutation();
  const [updateReservation, { isLoading: isUpdating }] =
    useUpdateReservationMutation();

  const handleInventoryChange = (value: number, index: number) => {
    const selectedInventory = inventoryOptions.find(
      (item) => item.value === value,
    );
    setValue(`reservationItems.${index}.unit`, selectedInventory?.unit ?? '');
    setValue(`reservationItems.${index}.inventoryId`, value);
  };

  const handleSubmit = (formData: TReservationActivityFormObject) => {
    const payload = {
      ...formData,
      expectedCheckInDate: dayjs(formData?.expectedCheckInDate).format(
        'YYYY-MM-DD',
      ) as unknown as Date,
    };

    if (isEditing) {
      // To delete file in the backend, need to send empty string
      if (payload?.fileUrls?.[0] !== '' || !!payload?.file) {
        delete payload?.fileUrls;
      } else {
        payload.fileUrls = '' as unknown as string[];
      }

      updateReservation({
        data: payload,
        id: data?.id ?? 0,
      })
        .unwrap()
        .then(() => {
          toast(
            generateDynamicToastMessage({
              title: 'Success',
              description: `Reservation updated successfully`,
              variant: 'success',
            }),
          );
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
    } else {
      delete payload?.fileUrls;
      postReservation({
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

  const haveDeliveryOrderId =
    !!formValues.orderDeliveryId || !!data?.orderDelivery?.id;

  const handleOrderDeliveryIdChange = (value: number) => {
    const selected = deliveryOrderOptions?.find((item) => {
      return item.value === value;
    });

    if (!selected || !selected?.orderDeliveryItems) return;

    reservationForm.setValue(
      'reservationItems',
      selected?.orderDeliveryItems?.map((item) => ({
        inventoryId: item?.inventoryId,
        amount: item?.amount,
        unit:
          inventoryOptions?.find((inv) => inv?.id === item?.inventoryId)
            ?.unit ?? '',
      })),
    );
    reservationForm.setValue('vendorId', selected?.vendor?.id ?? undefined);
    reservationForm.setValue(
      'expectedCheckInDate',
      new Date(selected?.expectedDeliveryDate) ?? new Date(),
    );
  };

  const filterInventoryOptions = (inventoryIds?: (number | undefined)[]) => {
    if (!inventoryIds) return inventoryOptions;

    return inventoryOptions?.filter((item) => {
      return !inventoryIds.includes(item.value);
    });
  };

  const hideDeliveryOrderId = isEditing && !data?.orderDelivery?.id;

  return (
    <form
      id="reservationForm"
      onSubmit={reservationForm.handleSubmit(handleSubmit)}
      className="max-h-[90vh] overflow-y-auto"
    >
      <div className="grid max-h-[320px] gap-4 overflow-y-auto sm:max-h-max sm:grid-cols-1 md:grid-cols-3">
        <div className="col-span-2 flex flex-col gap-4">
          {isEditing && (
            <p className="pb-2 font-bold">Reservation ID: {data?.id}</p>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="category"
              control={control}
              render={({
                field: { onChange, value, onBlur },
                fieldState: { error },
              }) => (
                <InputRadioGroup
                  label="Category"
                  gap={5}
                  value={value}
                  onBlur={onBlur}
                  onChange={(e) => {
                    onChange(e);
                    setValue('orderDeliveryId', undefined);
                  }}
                  errorMessage={error?.message}
                  required
                  disabled={
                    haveDeliveryOrderId &&
                    isEditing &&
                    data?.category === 'OUTBOUND'
                  }
                  options={[
                    {
                      label: 'Outbound',
                      value: ReservationCategoryEnum.OUTBOUND,
                    },
                    {
                      label: 'Inbound',
                      value: ReservationCategoryEnum.INBOUND,
                    },
                  ]}
                />
              )}
            />

            <Controller
              name="isPriority"
              control={control}
              render={({ field: { onChange, value } }) => {
                return (
                  <div className="flex flex-col items-start">
                    <Checkbox
                      labelContainer="Type"
                      label="Priority"
                      checked={value}
                      onChange={onChange}
                    />
                  </div>
                );
              }}
            />
          </div>

          {formValues.category === 'OUTBOUND' && !hideDeliveryOrderId ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-start">
                <Controller
                  control={control}
                  name="isUseDeliveryOrderId"
                  render={({ field: { onChange, value } }) => (
                    <Checkbox
                      labelContainer="Delivery Order"
                      label="Delivery Order ID"
                      disabled={
                        haveDeliveryOrderId &&
                        isEditing &&
                        data?.category === 'OUTBOUND'
                      }
                      onChange={(event) => {
                        onChange(event.target.checked);
                        setValue('orderDeliveryId', undefined);
                      }}
                      checked={value}
                    />
                  )}
                />
              </div>

              {formValues.isUseDeliveryOrderId && (
                <Controller
                  name="orderDeliveryId"
                  control={control}
                  render={({
                    field: { onChange, value, onBlur },
                    fieldState: { error },
                  }) => (
                    <SelectComponent
                      label="Delivery Order ID"
                      placeholder="Search Delivery Order ID"
                      value={value}
                      disabled={
                        haveDeliveryOrderId &&
                        isEditing &&
                        data?.category === 'OUTBOUND'
                      }
                      onChange={(e) => {
                        onChange(e);
                        handleOrderDeliveryIdChange(e);
                      }}
                      onBlur={onBlur}
                      options={deliveryOrderOptions}
                      loading={isLoadingDeliveryOrderOptions}
                      required
                      errorMessage={error?.message}
                    />
                  )}
                />
              )}
            </div>
          ) : null}

          <Controller
            name="vendorId"
            control={control}
            render={({
              field: { onChange, value, onBlur },
              fieldState: { error },
            }) => (
              <SelectComponent
                label="Vendor"
                placeholder="Select Vendor"
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                disabled={haveDeliveryOrderId}
                options={vendorOptions}
                loading={isLoadingVendorOptions}
                required
                errorMessage={error?.message}
              />
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="driverId"
              control={control}
              render={({
                field: { onChange, value, onBlur },
                fieldState: { error },
              }) => (
                <SelectComponent
                  label="Driver Name"
                  placeholder="Select Driver Name"
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  options={driverNameOptions}
                  loading={isLoadingDriverNameOptions}
                  required
                  errorMessage={error?.message}
                />
              )}
            />
            <Controller
              name="licensePlateId"
              control={control}
              render={({
                field: { onChange, value, onBlur },
                fieldState: { error },
              }) => (
                <SelectComponent
                  label="Vehicle"
                  placeholder="Select Vehicle"
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  options={licensePlateOptions}
                  loading={isLoadingLicensePlateOptions}
                  required
                  errorMessage={error?.message}
                />
              )}
            />
          </div>
          <div className="grid grid-cols-2 items-start gap-4">
            <div>
              <Controller
                name="expectedCheckInDate"
                control={control}
                render={({
                  field: { onChange, value, onBlur },
                  fieldState: { error },
                }) => (
                  <>
                    <InputDatePickerComponent
                      label="Expected Check-In"
                      placeholder="Expected Check-In Date"
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                      required
                      disabledCalendar={(date) =>
                        dayjs(date).isBefore(dayjs().startOf('day'))
                      }
                    />
                    {error?.message && (
                      <p className="text-rs-v2-red">{error?.message}</p>
                    )}
                  </>
                )}
              />
            </div>
            <div>
              <Controller
                name="documentId"
                control={control}
                render={({ field: { onChange, value, onBlur } }) => (
                  <InputComponent
                    label="Document ID"
                    placeholder="Document ID"
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
            </div>
          </div>

          <div>
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
                            formState.errors.file = {
                              type: 'required',
                              message: 'File is required',
                            };
                          }}
                        />
                      </div>
                    )}
                    {isEditing &&
                      !formValues?.file &&
                      formValues?.fileUrls?.map((fileUrl, index) => {
                        if (fileUrl === '') return null;

                        return (
                          <div
                            className="ml-2 flex flex-row items-center"
                            key={index}
                          >
                            <span
                              className="cursor-pointer text-xs underline"
                              onClick={() => {
                                downloadFileWithBearerToken(fileUrl);
                              }}
                            >
                              {loadingMetadataFile
                                ? 'Loading Existing File...'
                                : metadataFile
                                  ? metadataFile?.data?.original_name +
                                    '.' +
                                    metadataFile?.data?.extension
                                  : 'Download File'}
                            </span>
                            <MdClose
                              size={20}
                              className="cursor-pointer text-red-500"
                              onClick={() => {
                                reservationForm.setValue('fileUrls', ['']);
                              }}
                            />
                          </div>
                        );
                      })}
                  </div>
                  <p className="pt-2 text-xs text-red-500">{error?.message}</p>
                </div>
              )}
            />
          </div>

          <div className="border-b border-solid border-b-rs-v2-thunder-blue" />

          <div>
            {!haveDeliveryOrderId ? (
              <Button
                type="button"
                onClick={() =>
                  appendFieldArray({
                    inventoryId: undefined as unknown as number,
                    amount: undefined as unknown as number,
                    unit: '',
                  })
                }
                className="mb-3 ml-auto flex gap-2 bg-transparent text-rs-v2-mint hover:bg-rs-v2-mint hover:text-rs-v2-navy-blue disabled:text-rs-v2-grey-disable"
              >
                Add Inventory <MdAdd size={16} />
              </Button>
            ) : null}

            <table className="w-full table-auto border-separate border-spacing-0 rounded-md border border-solid border-rs-v2-gunmetal-blue">
              <thead className="text-left">
                <tr>
                  <th className="w-[260px] p-3">Inventory</th>
                  <th className="border-l border-solid border-rs-v2-gunmetal-blue p-2 text-left">
                    Amount
                  </th>
                  {!isEditing || haveDeliveryOrderId ? null : (
                    <th className="border-l border-solid border-rs-v2-gunmetal-blue p-2 text-left"></th>
                  )}
                </tr>
              </thead>
              <tbody>
                {fields.map((field, index) => (
                  <tr
                    className="table-row bg-rs-v2-galaxy-blue"
                    key={field?.id}
                  >
                    <td className="border-t border-solid border-rs-v2-gunmetal-blue p-2 text-left ">
                      <Controller
                        name={`reservationItems.${index}.inventoryId`}
                        control={control}
                        render={({ field: { value } }) => {
                          // to prevent duplicate inventory
                          const selectedInvyIds =
                            formValues?.reservationItems?.map(
                              (item) => item.inventoryId,
                            );
                          const filteredSelectedInvIds =
                            selectedInvyIds?.filter((id) => id !== value);
                          const filteredOptions = filterInventoryOptions(
                            filteredSelectedInvIds,
                          );

                          return (
                            <SelectComponent
                              options={filteredOptions}
                              className={cn(
                                'rc-select--navy-blue h-12',
                                haveDeliveryOrderId &&
                                  '[&>.rc-select-selector]:!border-0 [&>.rc-select-selector]:!bg-rs-v2-galaxy-blue [&>.rc-select-selector]:!text-white',
                              )}
                              placeholder="Select Inventory"
                              onChange={(value) =>
                                handleInventoryChange(value, index)
                              }
                              value={value}
                              disabled={haveDeliveryOrderId}
                            />
                          );
                        }}
                      />
                    </td>
                    <td className="inline-flex w-full items-center gap-2 border-l border-t border-solid border-rs-v2-gunmetal-blue p-2 text-left">
                      <Controller
                        name={`reservationItems.${index}.amount`}
                        control={control}
                        render={({ field: { onChange, value } }) => (
                          <InputComponent
                            value={value}
                            type="number"
                            onInput={(event) => {
                              const input = event.currentTarget.value;
                              if (!input || /^-?\d*[.,]?\d*$/.test(input)) {
                                onChange(event.currentTarget.valueAsNumber);
                              }
                            }}
                            placeholder="Amount"
                            inputStyle={cn(
                              'h-[39px] w-28 bg-rs-v2-navy-blue focus-visible:ring-0 focus-visible:ring-offset-0 hover:enabled:border-rs-v2-mint focus:enabled:border-rs-v2-mint  active:enabled:border-rs-v2-mint disabled:border-rs-v2-slate-blue disabled:bg-rs-v2-slate-blue disabled:text-rs-v2-gunmetal-blue disabled:opacity-100 placeholder:disabled:text-rs-v2-gunmetal-blue',
                              haveDeliveryOrderId &&
                                '!border-0 !bg-rs-v2-galaxy-blue !text-white',
                            )}
                            containerStyle={cn(haveDeliveryOrderId && 'w-fit')}
                            disabled={haveDeliveryOrderId}
                          />
                        )}
                      />
                      <span>
                        {
                          inventoryOptions?.find(
                            (item) =>
                              item.value ===
                              formValues?.reservationItems?.[index]
                                ?.inventoryId,
                          )?.unit
                        }
                      </span>
                    </td>
                    {!haveDeliveryOrderId && (
                      <td className="border-l border-t border-solid border-rs-v2-gunmetal-blue p-2 text-left">
                        <Button
                          type="button"
                          disabled={index === 0}
                          onClick={() => removeFieldArray(index)}
                          className="bg-transparent p-[5px] text-rs-v2-red hover:bg-rs-v2-red hover:text-white"
                        >
                          <MdDeleteOutline size={24} />
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {formValues?.reservationItems?.map((item, index) => {
            const inventory = inventoryOptions?.find(
              (inv) => inv.value === item.inventoryId,
            );
            return (
              <div
                key={index}
                className="flex gap-2 text-sm italic text-rs-alert-warning"
              >
                <p className="font-semibold">{inventory?.name}</p>
                {inventory?.name && <p>stock available only</p>}
                <p className="font-semibold">{inventory?.stock}</p>
                <p>{inventory?.unit}</p>
              </div>
            );
          })}
        </div>

        <div className="col-span-1 flex h-full w-full flex-col items-start gap-3">
          <Controller
            name="tagId"
            control={control}
            render={({
              field: { onChange, value, onBlur },
              fieldState: { error },
            }) => (
              <SelectComponent
                placeholder="Search RFID Tag ID"
                onChange={onChange}
                onBlur={onBlur}
                label="RFID Tag ID"
                value={value}
                options={tagOptions}
                loading={isLoadingTagOptions}
                required
                errorMessage={error?.message}
              />
            )}
          />
          <p className="mx-auto text-rs-neutral-chromium">QR-Code</p>
          {formValues?.tagId !== undefined ? (
            <div
              id="printQr"
              className="mx-auto h-auto w-full max-w-[180px] rounded-md bg-white p-2 md:max-w-full"
            >
              <QRCode
                bgColor="#35363a"
                fgColor="#FFFFFF"
                style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
                value={
                  isEditing
                    ? (formValues?.tagId ?? '')?.toString()
                    : data?.tag?.id?.toString() ?? ''
                }
                viewBox={`0 0 256 256`}
              />
            </div>
          ) : (
            <div className="flex w-full flex-1 items-center justify-center text-center">
              <p className="text-center text-rs-neutral-chromium">
                Select RFID Tag First
              </p>
            </div>
          )}
        </div>
      </div>

      <DrawerSubmitAction
        form="reservationForm"
        disabled={isSubmitting || isUpdating || !formState.isValid}
        toggle={toggle}
        submitText={isEditing ? 'Update Reservation' : 'Add Reservation'}
      />
    </form>
  );
};

export default ReservationForm;
