import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useMemo } from 'react';
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from 'react-hook-form';
import { AiOutlinePlus } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';

import DrawerSubmitAction from '@/components/Form/DrawerSubmitAction';
import InputComponent from '@/components/InputComponent';
import SwitchComponent from '@/components/Switch';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

import { TModalFormProps } from '@/types/modal';
import {
  useGetInventoryGroupsQuery,
  useInventoryManageGroupsMutation,
} from '@/stores/managementStore/inventoryStore';
import {
  IInventory,
  TManageGroupInventoryRequestFormObject,
} from '@/types/api/management/inventory';
import { ErrorMessageBackendDataShape } from '@/types/api';

import generateDynamicToastMessage from '@/utils/functions/generateDynamicToastMessage';
import manageInventoryGroupValidationSchema from '@/utils/validations/management/inventory/manageInventoryGroupValidationSchema';
import generateStatusCodesMessage from '@/utils/functions/generateStatusCodesMessage';

const ManageInventoryGroupForm = ({ toggle }: TModalFormProps<IInventory>) => {
  const { toast } = useToast();
  const { data: inventoryGroupData, isLoading } = useGetInventoryGroupsQuery({
    isPaginated: false,
  });
  const initialInventoryGroupMemo = useMemo<
    { name: string; isShow: boolean }[]
  >(() => {
    if (!inventoryGroupData || !inventoryGroupData.entities) return [];
    const list = inventoryGroupData.entities.slice();
    const sanitizedData = list.map((item) => {
      return {
        id: item.id,
        isShow: item.isShow ?? false,
        name: item.name,
      };
    });
    return sanitizedData;
  }, [inventoryGroupData]);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { isDirty, isValid },
  } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: {
      inventoryGroups: initialInventoryGroupMemo ?? [],
    },
    resolver: yupResolver(manageInventoryGroupValidationSchema),
  });
  const {
    fields,
    append: appendFieldArray,
    remove: removeFieldArray,
  } = useFieldArray({
    control,
    name: 'inventoryGroups',
  });

  const [inventoryManageGroups] = useInventoryManageGroupsMutation();

  useEffect(() => {
    if (!isLoading && initialInventoryGroupMemo) {
      setValue('inventoryGroups', initialInventoryGroupMemo);
    }
  }, [isLoading, initialInventoryGroupMemo]);

  const handleSubmitData: SubmitHandler<
    TManageGroupInventoryRequestFormObject
  > = async (formData, event) => {
    if (!formData.inventoryGroups) return;
    const submitData = formData.inventoryGroups;
    event?.preventDefault();
    await inventoryManageGroups(submitData)
      .unwrap()
      .then(() => {
        toast(
          generateDynamicToastMessage({
            title: 'Success',
            description: `Success manage inventory groups`,
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
    <form id="manageInventoryGroup" onSubmit={handleSubmit(handleSubmitData)}>
      <p>
        Grouping your inventory can help you to organize and set up. You can
        create new group and assign them names.
      </p>
      <Button
        onClick={() => appendFieldArray({ name: '', isShow: false })}
        variant={'ghost'}
        type="button"
        className="my-4 text-rs-v2-mint hover:bg-rs-v2-mint hover:text-rs-v2-navy-blue"
      >
        Add Group <AiOutlinePlus className="ml-2" />
      </Button>
      <div className="max-h-[320px] overflow-y-auto">
        {fields.map((field, index) => (
          <div className="mb-4 flex items-center gap-2" key={field.id}>
            <div className="flex-1">
              <Controller
                name={`inventoryGroups.${index}.name`}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <InputComponent
                    value={value}
                    onChange={onChange}
                    placeholder="Name Group..."
                  />
                )}
              />
            </div>
            <div className="flex flex-1 items-center justify-center gap-2">
              <p>HIDE</p>
              <Controller
                name={`inventoryGroups.${index}.isShow`}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <SwitchComponent
                    className="data-[state=unchecked]:bg-rs-v2-grey-disable"
                    onCheckedChange={onChange}
                    defaultChecked={value}
                    value={value ?? false}
                  />
                )}
              />
              <p>SHOW</p>
            </div>
            <Button
              type="button"
              onClick={() => removeFieldArray(index)}
              className="w-9 bg-transparent p-[5px] text-rs-v2-red hover:bg-rs-v2-red hover:text-white disabled:text-rs-v2-grey-disable"
            >
              <MdDelete size={24} />
            </Button>
          </div>
        ))}
      </div>
      <DrawerSubmitAction
        toggle={toggle}
        submitText="Save Changes"
        disabled={!isDirty || !isValid}
        form="manageInventoryGroup"
        cancelText="Cancel"
      />
    </form>
  );
};

export default ManageInventoryGroupForm;
