import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import DrawerSubmitAction from '@/components/Form/DrawerSubmitAction';
import InputComponent from '@/components/InputComponent';
import Spinner from '@/components/Spinner';
import { toast } from '@/components/ui/use-toast';

import {
  usePatchVendorMutation,
  usePostVendorMutation,
} from '@/stores/vendorStore/vendorStoreApi';

import { ErrorMessageBackendDataShape } from '@/types/api';
import { TReservationVendorFormObject, TVendor } from '@/types/api/reservation';
import { TModalFormProps } from '@/types/modal';

import generateDynamicToastMessage from '@/utils/functions/generateDynamicToastMessage';
import generateStatusCodesMessage from '@/utils/functions/generateStatusCodesMessage';
import isFieldRequired from '@/utils/functions/isFieldRequired';
import reservationVendorValidationSchema from '@/utils/validations/reservation/reservationVendorValidationSchema';


const VendorForm = ({ data, toggle, isEditing }: TModalFormProps<TVendor>) => {
  const {
    control,
    handleSubmit,
    formState: { isDirty, isValid },
  } = useForm<TReservationVendorFormObject>({
    defaultValues: {
      name: data?.name ?? '',
      email: data?.email ?? '',
      address: data?.address ?? '',
      annotation: data?.annotation ?? '',
    },
    resolver: yupResolver(reservationVendorValidationSchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

  const [createVendor, { isLoading: isCreatingVendor }] =
    usePostVendorMutation();

  const [updateVendor, { isLoading: isEditingVendor }] =
    usePatchVendorMutation();

  const isRequired = (
    fieldName: keyof TReservationVendorFormObject,
  ): boolean => {
    const value = isFieldRequired<TReservationVendorFormObject>(
      reservationVendorValidationSchema,
      fieldName,
    );
    return value;
  };

  const handleSubmitItem: SubmitHandler<TReservationVendorFormObject> = async (
    formData,
    event,
  ) => {
    event?.preventDefault();
    const baseFormData = {
      name: formData?.name ?? '',
      email: formData?.email ?? '',
      address: formData?.address ?? '',
      annotation: formData?.annotation ?? undefined,
    };
    if (isEditing) {
      if (!data?.id || !formData) return;
      const formDataUpdate: TReservationVendorFormObject = { ...baseFormData };
      await updateVendor({ id: data?.id, ...formDataUpdate })
        .unwrap()
        .then(() => {
          toggle();
          toast(
            generateDynamicToastMessage({
              title: 'Success',
              description: 'Vendor updated successfully',
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
      const formDataCreate: TReservationVendorFormObject = {
        ...baseFormData,
      };
      await createVendor(formDataCreate)
        .unwrap()
        .then(() => {
          toggle();
          toast(
            generateDynamicToastMessage({
              title: 'Success',
              description: 'Vendor created successfully',
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
    <form id="vendorForm" onSubmit={handleSubmit(handleSubmitItem)}>
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
              containerStyle="mb-3 gap-2 grid w-full"
              errorMessage={error?.message}
            />
          );
        }}
      />{' '}
      <Controller
        name="address"
        control={control}
        render={({
          field: { onChange, value, onBlur },
          fieldState: { error },
        }) => {
          return (
            <InputComponent
              label="Address"
              placeholder="Address"
              onChange={onChange}
              onBlur={onBlur}
              containerStyle="mb-3 gap-2 grid w-full"
              required={isRequired('address')}
              value={value}
              errorMessage={error?.message}
            />
          );
        }}
      />
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
          isCreatingVendor || isEditingVendor ? (
            <Spinner size={18} borderWidth={1.5} isFullWidthAndHeight />
          ) : isEditing ? (
            'Save Changes'
          ) : (
            'Add Vendor'
          )
        }
        disabled={!isDirty || !isValid}
        toggle={toggle}
        form="vendorForm"
      />
    </form>
  );
};

export default VendorForm;
