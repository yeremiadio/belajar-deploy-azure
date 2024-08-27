import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import DrawerSubmitAction from '@/components/Form/DrawerSubmitAction';
import InputComponent from '@/components/InputComponent';
import { useToast } from '@/components/ui/use-toast';

import {
  IMachine,
  TNewGroupMachineRequestFormObject,
} from '@/types/api/management/machine';
import { TModalFormProps } from '@/types/modal';

import generateDynamicToastMessage from '@/utils/functions/generateDynamicToastMessage';
import isFieldRequired from '@/utils/functions/isFieldRequired';
import newGroupMachineValidationSchema from '@/utils/validations/management/machine/newGroupMachineValidationSchema';
import { useCreateMachineGroupMutation } from '@/stores/managementStore/machineStore/machineStoreApi';
import { ErrorMessageBackendDataShape } from '@/types/api';
import generateStatusCodesMessage from '@/utils/functions/generateStatusCodesMessage';

const NewMachineGroupForm = ({ toggle, data }: TModalFormProps<IMachine>) => {
  const { toast } = useToast();
  const {
    control,
    handleSubmit,
    formState: { isDirty, isValid },
  } = useForm<TNewGroupMachineRequestFormObject>({
    defaultValues: {
      name: data?.name ?? '',
    },
    resolver: yupResolver(newGroupMachineValidationSchema),
    mode: 'all',
    reValidateMode: 'onSubmit',
  });

  const [createMachineGroup, { isLoading: isLoadingCreateMachineGroup }] =
    useCreateMachineGroupMutation();

  const isRequired = (
    fieldName: keyof TNewGroupMachineRequestFormObject,
  ): boolean => {
    const value = isFieldRequired<TNewGroupMachineRequestFormObject>(
      newGroupMachineValidationSchema,
      fieldName,
    );
    return value;
  };

  const handleSubmitData: SubmitHandler<
    TNewGroupMachineRequestFormObject
  > = async (formData, event) => {
    event?.preventDefault();
    const submitData = {
      ...formData,
      isShow: true,
    };
    await createMachineGroup(submitData)
      .unwrap()
      .then(() => {
        toast(
          generateDynamicToastMessage({
            title: 'Success',
            description: `Success create group machine ${formData.name}`,
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
  };

  return (
    <form
      className="grid grid-cols-1 gap-4"
      id="newMachineGroupForm"
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
              label="Group Name"
              placeholder="Group Name..."
              onChange={onChange}
              onBlur={onBlur}
              required={isRequired('name')}
              value={value}
              errorMessage={error?.message}
            />
          );
        }}
      />
      <DrawerSubmitAction
        submitText={'Add Group'}
        disabled={!isDirty || !isValid || isLoadingCreateMachineGroup}
        toggle={toggle}
        form="newMachineGroupForm"
      />
    </form>
  );
};

export default NewMachineGroupForm;
