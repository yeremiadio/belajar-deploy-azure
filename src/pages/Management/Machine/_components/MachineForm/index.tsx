import { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import DrawerSubmitAction from '@/components/Form/DrawerSubmitAction';
import InputComponent from '@/components/InputComponent';
import SelectComponent from '@/components/Select';
import { useToast } from '@/components/ui/use-toast';

import {
  IMachine,
  IMachineFormObject,
  TMachineRequestFormObject,
} from '@/types/api/management/machine';
import { TModalFormProps } from '@/types/modal';

import generateDynamicToastMessage from '@/utils/functions/generateDynamicToastMessage';
import isFieldRequired from '@/utils/functions/isFieldRequired';
import useLocationOpts from '@/utils/hooks/selectOptions/useLocationOptions';
import machineValidationSchema from '@/utils/validations/management/machine/machineValidationSchema';
import filterObjectIfValueIsEmpty from '@/utils/functions/filterObjectIfValueIsEmpty';
import {
  useCreateMachineMutation,
  useUpdateMachineMutation,
} from '@/stores/managementStore/machineStore/machineStoreApi';
import { ErrorMessageBackendDataShape } from '@/types/api';
import generateStatusCodesMessage from '@/utils/functions/generateStatusCodesMessage';

const MachineForm = ({
  toggle,
  isEditing,
  data,
}: TModalFormProps<IMachine>) => {
  const { toast } = useToast();
  const [searchLocation, setSearchLocation] = useState<string>('');
  const {
    control,
    handleSubmit,
    formState: { isDirty, isValid },
  } = useForm<TMachineRequestFormObject>({
    defaultValues: {
      name: data?.name ?? '',
      code: data?.code ?? '',
      locationId: data?.location.id ?? undefined,
    },
    resolver: yupResolver(machineValidationSchema),
    mode: 'all',
    reValidateMode: 'onSubmit',
  });

  const [createMachine, { isLoading: isLoadingCreateMachine }] =
    useCreateMachineMutation();
  const [updateMachine, { isLoading: isLoadingUpdateMachine }] =
    useUpdateMachineMutation();

  const { arr: locationOpts, isLoading: isLoadingLocationOpts } =
    useLocationOpts({
      search: searchLocation,
      isPaginated: false,
    });

  const isRequired = (fieldName: keyof TMachineRequestFormObject): boolean => {
    const value = isFieldRequired<TMachineRequestFormObject>(
      machineValidationSchema,
      fieldName,
    );
    return value;
  };

  const handleOnSearchLocation = (val: string) => {
    setSearchLocation(val);
  };

  const handleSubmitData: SubmitHandler<TMachineRequestFormObject> = async (
    formData,
    event,
  ) => {
    event?.preventDefault();
    const submitData: IMachineFormObject = {
      name: formData.name ?? '',
      locationId: formData.locationId ?? 0,
      code: formData.code ?? '',
    };
    const filteredData = filterObjectIfValueIsEmpty(submitData);
    if (!isEditing) {
      await createMachine(filteredData)
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
      await updateMachine({ ...submitData, id: data.id })
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
      className="grid grid-cols-1 gap-4"
      id="machineForm"
      onSubmit={handleSubmit(handleSubmitData)}
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
              label="Machine Name"
              placeholder="Machine Name..."
              onChange={onChange}
              onBlur={onBlur}
              required={isRequired('name')}
              value={value}
              errorMessage={error?.message}
            />
          );
        }}
      />
      <Controller
        name="code"
        control={control}
        render={({
          field: { onChange, value, onBlur },
          fieldState: { error },
        }) => {
          return (
            <InputComponent
              label="Machine ID"
              // disabled={isEditing}
              placeholder="Machine ID..."
              onChange={onChange}
              onBlur={onBlur}
              required={isRequired('code')}
              value={value}
              errorMessage={error?.message}
            />
          );
        }}
      />
      <Controller
        name="locationId"
        control={control}
        render={({ field: { onChange, value } }) => {
          return (
            <SelectComponent
              onChange={onChange}
              value={value}
              label="Location"
              required={isRequired('locationId')}
              onSearch={handleOnSearchLocation}
              options={locationOpts}
              placeholder="Select Location"
              loading={isLoadingLocationOpts}
            />
          );
        }}
      />
      <DrawerSubmitAction
        submitText={isEditing ? 'Save Changes' : 'Add Machine'}
        disabled={
          !isDirty ||
          !isValid ||
          isLoadingCreateMachine ||
          isLoadingUpdateMachine
        }
        toggle={toggle}
        form="machineForm"
      />
    </form>
  );
};

export default MachineForm;
