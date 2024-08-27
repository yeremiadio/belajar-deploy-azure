import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import DrawerSubmitAction from '@/components/Form/DrawerSubmitAction';
import InputComponent from '@/components/InputComponent';
import SelectComponent from '@/components/Select';
import { useToast } from '@/components/ui/use-toast';

import {
  useCreateLocationMutation,
  useUpdateLocationMutation,
} from '@/stores/managementStore/locationStore/locationStoreApi';

import { ErrorMessageBackendDataShape } from '@/types/api';
import {
  ILocation,
  ILocationSubmitFormObject,
  TLocationRequestFormObject,
} from '@/types/api/management/location';
import { TModalFormProps } from '@/types/modal';

import filterObjectIfValueIsEmpty from '@/utils/functions/filterObjectIfValueIsEmpty';
import generateDynamicToastMessage from '@/utils/functions/generateDynamicToastMessage';
import isFieldRequired from '@/utils/functions/isFieldRequired';
import useUserType from '@/utils/hooks/auth/useUserType';
import useCompanyOpts from '@/utils/hooks/selectOptions/useCompanyOptions';
import useShiftOptions from '@/utils/hooks/selectOptions/useShiftOptions';
import locationValidationSchema from '@/utils/validations/management/location/locationValidationSchema';
import generateStatusCodesMessage from '@/utils/functions/generateStatusCodesMessage';

const LocationForm = ({
  data,
  isEditing,
  toggle,
}: TModalFormProps<ILocation>) => {
  const { toast } = useToast();
  const currentUserType = useUserType();
  const {
    control,
    handleSubmit,
    setValue,
    formState: { isDirty, isValid },
  } = useForm<TLocationRequestFormObject>({
    defaultValues: {
      name: data?.name || '',
      shiftIds: data?.shifts.map((item) => item.id) || [],
      lat: data?.coordinate?.lat ? `${data?.coordinate?.lat}` : '',
      lng: data?.coordinate?.lng ? `${data?.coordinate?.lng}` : '',
      companyId: data?.company?.id ?? undefined,
    },
    resolver: yupResolver(locationValidationSchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

  const [createLocation, { isLoading: isLoadingCreateLocation }] =
    useCreateLocationMutation();
  const [updateLocation, { isLoading: isLoadingUpdateLocation }] =
    useUpdateLocationMutation();
  const { arr: shiftOptions, isLoading: isLoadingShiftOptions } =
    useShiftOptions({});
  const { arr: companyOptions, isLoading: isLoadingCompanyOptions } =
    useCompanyOpts(
      {
        isPaginated: false,
      },
      { skip: currentUserType !== 'systemadmin' },
    );
  const isRequired = (fieldName: keyof TLocationRequestFormObject): boolean => {
    const value = isFieldRequired<TLocationRequestFormObject>(
      locationValidationSchema,
      fieldName,
    );
    return value;
  };

  useEffect(() => {
    if (currentUserType && currentUserType === 'systemadmin') {
      setValue('isSuperAdmin', true);
    }
  }, []);

  const handleSubmitData = async (formData: TLocationRequestFormObject) => {
    const submittedShiftIds = formData?.shiftIds ? formData?.shiftIds : [];
    const companyIdByCurrentUserType =
      currentUserType === 'systemadmin' ? formData.companyId : data?.companyId;
    const submitData: ILocationSubmitFormObject = {
      companyId: companyIdByCurrentUserType,
      shiftIds:
        currentUserType !== 'systemadmin' ? submittedShiftIds : undefined,
      name: formData.name ?? '',
      lat: formData?.lat ? parseFloat(formData.lat) : undefined,
      lng: formData?.lng ? parseFloat(formData.lng) : undefined,
    };
    const filteredData = filterObjectIfValueIsEmpty(submitData);
    if (!isEditing) {
      await createLocation(filteredData)
        .unwrap()
        .then(() => {
          toggle();
          toast(
            generateDynamicToastMessage({
              title: 'Success',
              description: 'Location created successfully',
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
      if (!data?.id) return;
      await updateLocation({ data: submitData, id: data.id })
        .unwrap()
        .then(() => {
          toggle();
          toast(
            generateDynamicToastMessage({
              title: 'Success',
              description: 'Location updated successfully',
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
    <form
      id="locationForm"
      onSubmit={handleSubmit(handleSubmitData)}
      className="grid grid-cols-1 gap-4"
    >
      <Controller
        name="name"
        control={control}
        render={({
          field: { onChange, value, onBlur },
          fieldState: { error },
        }) => {
          return (
            <InputComponent
              label="Location"
              placeholder="Location Name..."
              onChange={onChange}
              onBlur={onBlur}
              required={isRequired('name')}
              value={value}
              errorMessage={error?.message}
            />
          );
        }}
      />
      {currentUserType === 'systemadmin' ? (
        <Controller
          name="companyId"
          control={control}
          render={({
            field: { onChange, value, onBlur },
            fieldState: { error },
          }) => {
            return (
              <SelectComponent
                allowClear
                options={companyOptions}
                value={value}
                label="Company"
                onBlur={onBlur}
                required={currentUserType === 'systemadmin'}
                placeholder="Search Company..."
                loading={isLoadingCompanyOptions}
                onChange={onChange}
                errorMessage={error?.message}
              />
            );
          }}
        />
      ) : (
        <Controller
          name="shiftIds"
          control={control}
          render={({
            field: { onChange, value, onBlur },
            fieldState: { error },
          }) => {
            return (
              <SelectComponent
                onChange={onChange}
                value={value}
                mode="multiple"
                label="Shift"
                placeholder="Shift..."
                onBlur={onBlur}
                errorMessage={error?.message}
                isError={!!error?.message}
                className="mb-3"
                loading={isLoadingShiftOptions}
                options={shiftOptions}
              />
            );
          }}
        />
      )}
      <div className="grid grid-cols-2 gap-2">
        <Controller
          name="lat"
          control={control}
          render={({
            field: { onChange, value, onBlur },
            fieldState: { error },
          }) => {
            return (
              <InputComponent
                label="Latitude"
                placeholder="Latitude..."
                onChange={onChange}
                onBlur={onBlur}
                type="number"
                value={value}
                errorMessage={error?.message}
              />
            );
          }}
        />
        <Controller
          name="lng"
          control={control}
          render={({
            field: { onChange, value, onBlur },
            fieldState: { error },
          }) => {
            return (
              <InputComponent
                label="Longitude"
                placeholder="Longitude..."
                onChange={onChange}
                onBlur={onBlur}
                type="number"
                value={value}
                errorMessage={error?.message}
              />
            );
          }}
        />
      </div>
      <DrawerSubmitAction
        submitText={isEditing ? 'Save Changes' : 'Add Location'}
        disabled={
          !isDirty ||
          !isValid ||
          isLoadingCreateLocation ||
          isLoadingUpdateLocation
        }
        toggle={toggle}
        form="locationForm"
      />
    </form>
  );
};

export default LocationForm;
