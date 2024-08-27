import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import DrawerSubmitAction from '@/components/Form/DrawerSubmitAction';
import InputComponent from '@/components/InputComponent';
import SelectComponent from '@/components/Select';
import Spinner from '@/components/Spinner';
import { toast } from '@/components/ui/use-toast';

import { usePatchLicensePlateMutation, usePostLicensePlateMutation } from '@/stores/licensePlateStore/licensePlateStoreApi';

import { ErrorMessageBackendDataShape } from '@/types/api';
import { TLicensePlate, TReservationVehicleFormObject } from '@/types/api/reservation';
import { TModalFormProps } from '@/types/modal';

import generateDynamicToastMessage from '@/utils/functions/generateDynamicToastMessage';
import generateStatusCodesMessage from '@/utils/functions/generateStatusCodesMessage';
import { getNumericCode, getPrefixCode, getSuffixCode } from '@/utils/functions/getLicensePlateCode';
import isFieldRequired from '@/utils/functions/isFieldRequired';
import useClassVehicleOptions from '@/utils/hooks/selectOptions/useClassVehicleOptions';
import reservationVehicleValidationSchema from '@/utils/validations/reservation/reservationVehicleValidationSchema';

const VehicleForm = ({ data, toggle, isEditing }: TModalFormProps<TLicensePlate>) => {
  const {
    control,
    handleSubmit,
    formState: { isDirty, isValid },
  } = useForm<TReservationVehicleFormObject>({
    defaultValues: {
        areaCode: getPrefixCode(data?.plate ?? ''),
        plateCode: getNumericCode(data?.plate ?? ''),
        lastCode: getSuffixCode(data?.plate ?? ''),
        class: data?.class ?? undefined,
        merk: data?.merk ?? '',
        series: data?.series ?? '',
        annotation: data?.annotation ?? '',
    },
    resolver: yupResolver(reservationVehicleValidationSchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

  const [createVehicle, { isLoading: isCreatingVehicle }] =
    usePostLicensePlateMutation();

  const [updateVehicle, { isLoading: isEditingVehicle }] =
    usePatchLicensePlateMutation();

  const { dataOptions: classVehicleOptions, isLoading: isLoadingClassVehicleOptions} = useClassVehicleOptions();

  const isRequired = (
    fieldName: keyof TReservationVehicleFormObject,
  ): boolean => {
    const value = isFieldRequired<TReservationVehicleFormObject>(
      reservationVehicleValidationSchema,
      fieldName,
    );
    return value;
  };

  const handleSubmitItem: SubmitHandler<TReservationVehicleFormObject> = async (
    formData,
    event,
  ) => {
    event?.preventDefault();
    const plate = formData.areaCode + formData.plateCode + formData.lastCode
    const baseFormData = {
      plate: plate.toUpperCase() ?? '',
      class: formData?.class ?? '',
      merk: formData?.merk ?? '',
      series: formData?.series ?? '',
      annotation: formData?.annotation ?? '',
    };
    if (isEditing) {
      if (!data?.id || !formData) return;
      const formDataUpdate: Partial<TLicensePlate> = { ...baseFormData };
      await updateVehicle({ id: data?.id, ...formDataUpdate })
        .unwrap()
        .then(() => {
          toggle();
          toast(
            generateDynamicToastMessage({
              title: 'Success',
              description: 'Vehicle updated successfully',
              variant: 'success',
            }),
          );
        })
        .catch((error: ErrorMessageBackendDataShape) => {
          toggle();
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
      const formDataCreate: Partial<TLicensePlate> = {
        ...baseFormData,
      };
      await createVehicle(formDataCreate)
        .unwrap()
        .then(() => {
          toggle();
          toast(
            generateDynamicToastMessage({
              title: 'Success',
              description: 'Vehicle created successfully',
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
    }
  };

  return (
    <form id="vehicleForm" onSubmit={handleSubmit(handleSubmitItem)}>
         <p className='mt-3'>License Plate<span className='text-rs-v2-red'>*</span></p>
        <div className="gap-4 grid grid-cols-3 my-3">
        <div className="flex flex-col">
        <Controller
            name="areaCode"
            control={control}
            render={({
              field: { onChange, value, onBlur },
              fieldState: { error },
            }) => {
              return (
                <InputComponent
                  placeholder="Area Code"
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                  required={isRequired('areaCode')}
                  errorMessage={error?.message}
                />
              );
            }}
          />
        </div>
        <div className="flex flex-col">
          <Controller
            name="plateCode"
            control={control}
            render={({
              field: { onChange, value, onBlur },
              fieldState: { error },
            }) => {
              return (
                <InputComponent
                  placeholder="Plate Number"
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                  required={isRequired('plateCode')}
                  errorMessage={error?.message}
                />
              );
            }}
          />
        </div>
        <div className="flex flex-col">
          <Controller
            name="lastCode"
            control={control}
            render={({
              field: { onChange, value, onBlur },
              fieldState: { error },
            }) => {
              return (
                <InputComponent
                  placeholder="Last Code Area"
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                  required={isRequired('lastCode')}
                  errorMessage={error?.message}
                />
              );
            }}
          />
        </div>
      </div>
      <Controller
        name="class"
        control={control}
        render={({
          field: { onChange, value },
          fieldState: { error },
        }) => {
          return (
            <SelectComponent
              label="Class"
              onChange={onChange}
              value={value}
              required={isRequired('class')}
              placeholder="Select Class"
              errorMessage={error?.message}
              className="gap-2 grid mb-3 w-full"
              isError={!!error?.message}
              options={classVehicleOptions}
              loading={isLoadingClassVehicleOptions}
            />
          );
        }}
        />
      <Controller
        name="merk"
        control={control}
        render={({
          field: { onChange, value, onBlur },
          fieldState: { error },
        }) => {
          return (
            <InputComponent
              label="Merk"
              placeholder="Merk"
              onChange={onChange}
              onBlur={onBlur}
              required={isRequired('merk')}
              containerStyle="mb-3 gap-2 grid w-full"
              value={value}
              errorMessage={error?.message}
            />
          );
        }}
      />{' '}
       
      <Controller
        name="series"
        control={control}
        render={({
          field: { onChange, value, onBlur },
          fieldState: { error },
        }) => {
          return (
            <InputComponent
              label="Series"
              placeholder="Series"
              onChange={onChange}
              onBlur={onBlur}
              containerStyle="mb-3 gap-2 grid w-full"
              required={isRequired('series')}
              value={value}
              errorMessage={error?.message}
            />
          );
        }}
      />
      <Controller
        name="annotation"
        control={control}
        render={({
          field: { onChange, value, onBlur },
          fieldState: { error },
        }) => {
          return (
            <InputComponent
              label="Annotation"
              placeholder="Annotation"
              onChange={onChange}
              onBlur={onBlur}
              containerStyle="mb-3 gap-2 grid w-full"
              required={isRequired('annotation')}
              value={value}
              errorMessage={error?.message}
            />
          );
        }}
      />
      <DrawerSubmitAction
        submitText={
          isCreatingVehicle || isEditingVehicle ? (
            <Spinner size={18} borderWidth={1.5} isFullWidthAndHeight />
          ) : isEditing ? (
            'Save Changes'
          ) : (
            'Add Vehicle'
          )
        }
        disabled={!isDirty || !isValid}
        toggle={toggle}
        form="vehicleForm"
      />
    </form>
  );
};

export default VehicleForm;
