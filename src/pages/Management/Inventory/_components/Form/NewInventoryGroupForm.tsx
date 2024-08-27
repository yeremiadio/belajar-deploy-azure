import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import DrawerSubmitAction from '@/components/Form/DrawerSubmitAction';
import InputComponent from '@/components/InputComponent';
import { useToast } from '@/components/ui/use-toast';

import { useCreateInventoryGroupsMutation } from '@/stores/managementStore/inventoryStore';

import {
  IInventory,
  TNewGroupInventoryRequestFormObject,
} from '@/types/api/management/inventory';
import { TModalFormProps } from '@/types/modal';

import { ErrorMessageBackendDataShape } from '@/types/api';
import generateDynamicToastMessage from '@/utils/functions/generateDynamicToastMessage';
import generateStatusCodesMessage from '@/utils/functions/generateStatusCodesMessage';
import isFieldRequired from '@/utils/functions/isFieldRequired';
import newGroupInventoryValidationSchema from '@/utils/validations/management/inventory/newGroupInventoryValidationSchema';



const NewInventoryGroupForm = ({ toggle, data }: TModalFormProps<IInventory>) => {
  const { toast } = useToast();
  const {
    control,
    handleSubmit,
    formState: { isDirty, isValid },
  } = useForm<TNewGroupInventoryRequestFormObject>({
    defaultValues: {
      name: data?.name ?? ''
    },
    resolver: yupResolver(newGroupInventoryValidationSchema),
    mode: 'all',
    reValidateMode: 'onSubmit',
  });

  const [createInventoryGroup, { isLoading: isLoadingCreateInventoryGroup }] =
  useCreateInventoryGroupsMutation();

  const isRequired = (
    fieldName: keyof TNewGroupInventoryRequestFormObject,
  ): boolean => {
    const value = isFieldRequired<TNewGroupInventoryRequestFormObject>(
      newGroupInventoryValidationSchema,
      fieldName,
    );
    return value;
  };

  const handleSubmitData: SubmitHandler<
    TNewGroupInventoryRequestFormObject
  > = async (formData, event) => {
    event?.preventDefault();
    const baseFormData = {
      name: formData?.name ?? "",
    };
    await createInventoryGroup({ ...baseFormData })
      .unwrap()
      .then(() => {
        toast(
          generateDynamicToastMessage({
            title: 'Success',
            description: `Success create group inventory ${formData.name}`,
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
      className="gap-4 grid grid-cols-1"
      id="newInventoryGroupForm"
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
        disabled={!isDirty || !isValid || isLoadingCreateInventoryGroup}
        toggle={toggle}
        form="newInventoryGroupForm"
      />
    </form>
  );
};

export default NewInventoryGroupForm;
