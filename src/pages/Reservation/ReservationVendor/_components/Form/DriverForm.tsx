import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import DrawerSubmitAction from '@/components/Form/DrawerSubmitAction';
import InputComponent from '@/components/InputComponent';
import SelectComponent from '@/components/Select';
import Spinner from '@/components/Spinner';
import { toast } from '@/components/ui/use-toast';

import { usePatchDriverMutation, usePostDriverMutation } from '@/stores/driverStore/driverStoreApi';

import { ErrorMessageBackendDataShape } from '@/types/api';
import { TModalFormProps } from '@/types/modal';

import { TDriver, TReservationDriverFormObject } from '@/types/api/reservation';
import filterObjectIfValueIsEmpty from '@/utils/functions/filterObjectIfValueIsEmpty';
import generateDynamicToastMessage from '@/utils/functions/generateDynamicToastMessage';
import generateStatusCodesMessage from '@/utils/functions/generateStatusCodesMessage';
import isFieldRequired from '@/utils/functions/isFieldRequired';
import useIdentityTypeOptions from '@/utils/hooks/selectOptions/useIdentityTypeOptions';
import reservationDriverValidationSchema from '@/utils/validations/reservation/reservationDriverValidationSchema';

const DriverForm = ({ data, toggle, isEditing }: TModalFormProps<TDriver>) => {
  const {
    control,
    handleSubmit,
    formState: { isDirty, isValid },
  } = useForm<TReservationDriverFormObject>({
    defaultValues: {
      name: data?.name ?? '',
      email: data?.email ?? '',
      phoneNumber: data?.phoneNumber ?? '',
      identity: data?.identity ?? undefined,
      identityNumber: data?.identityNumber ?? '',
    },
    resolver: yupResolver(reservationDriverValidationSchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

  const [createDriver, { isLoading: isCreatingDriver }] =
    usePostDriverMutation();

  const [updateDriver, { isLoading: isEditingDriver }] =
    usePatchDriverMutation();

  const { dataOptions: identityDriverOptions, isLoading: isLoadingIdentityDriverOptions} = useIdentityTypeOptions()

  const isRequired = (
    fieldName: keyof TReservationDriverFormObject,
  ): boolean => {
    const value = isFieldRequired<TReservationDriverFormObject>(
      reservationDriverValidationSchema,
      fieldName,
    );
    return value;
  };

  const handleSubmitItem: SubmitHandler<TReservationDriverFormObject> = async (
    formData,
    event,
  ) => {
    event?.preventDefault();
    const baseFormData: TReservationDriverFormObject = {
      name: formData?.name ?? '',
      email: formData?.email ?? '',
      phoneNumber: formData?.phoneNumber ?? '',
      identity: formData?.identity ?? '',
      identityNumber: formData?.identityNumber ?? '',
    };

    const filteredData = filterObjectIfValueIsEmpty(baseFormData);
    if (isEditing) {
      if (!data?.id || !formData) return;
      await updateDriver({ id: data?.id, ...filteredData })
        .unwrap()
        .then(() => {
          toggle();
          toast(
            generateDynamicToastMessage({
              title: 'Success',
              description: 'Driver updated successfully',
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
      await createDriver({...filteredData})
        .unwrap()
        .then(() => {
          toggle();
          toast(
            generateDynamicToastMessage({
              title: 'Success',
              description: 'Driver created successfully',
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
    <form id="driverForm" onSubmit={handleSubmit(handleSubmitItem)}>
      <Controller
        name="name"
        control={control}
        render={({
          field: { onChange, value, onBlur },
          fieldState: { error },
        }) => {
          return (
            <InputComponent
              label="Name"
              placeholder="Name"
              onChange={onChange}
              onBlur={onBlur}
              required={isRequired('name')}
              value={value}
              errorMessage={error?.message}
            />
          );
        }}
      />{' '}
        <p className='mt-3'>Identity<span className='text-rs-v2-red'>*</span></p>
        <div className="gap-4 grid grid-cols-2 my-3">
        <div className="flex flex-col">
        <Controller
        name="identity"
        control={control}
        render={({
          field: { onChange, value },
          fieldState: { error },
        }) => {
          return (
            <SelectComponent
              onChange={onChange}
              value={value}
              required={isRequired('identity')}
              placeholder="Identity"
              errorMessage={error?.message}
              isError={!!error?.message}
              options={identityDriverOptions}
              loading={isLoadingIdentityDriverOptions}
            />
          );
        }}
          />{' '}
        </div>
        <div className="flex flex-col">
          <Controller
            name="identityNumber"
            control={control}
            render={({
              field: { onChange, value, onBlur },
              fieldState: { error },
            }) => {
              return (
                <InputComponent
                  placeholder="Identity Number"
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                  errorMessage={error?.message}
                />
              );
            }}
          />
        </div>
      </div>
      <Controller
        name="email"
        control={control}
        render={({
          field: { onChange, value, onBlur },
          fieldState: { error },
        }) => {
          return (
            <InputComponent
              label="Email"
              placeholder="Email"
              onChange={onChange}
              onBlur={onBlur}
              containerStyle="mb-3 gap-2 grid w-full"
              required={isRequired('email')}
              value={value}
              errorMessage={error?.message}
            />
          );
        }}
      />
      <Controller
        name="phoneNumber"
        control={control}
        render={({
          field: { onChange, value, onBlur },
          fieldState: { error },
        }) => {
          return (
            <InputComponent
              label="No. HP"
              placeholder="No. HP"
              onChange={onChange}
              onBlur={onBlur}
              containerStyle="mb-3 gap-2 grid w-full"
              required={isRequired('phoneNumber')}
              value={value}
              errorMessage={error?.message}
            />
          );
        }}
      />
      <DrawerSubmitAction
        submitText={
          isCreatingDriver || isEditingDriver ? (
            <Spinner size={18} borderWidth={1.5} isFullWidthAndHeight />
          ) : isEditing ? (
            'Save Changes'
          ) : (
            'Add Driver'
          )
        }
        disabled={!isDirty || !isValid}
        toggle={toggle}
        form="driverForm"
      />
    </form>
  );
};

export default DriverForm;
