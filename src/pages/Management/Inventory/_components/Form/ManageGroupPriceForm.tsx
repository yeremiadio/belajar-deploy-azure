import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo } from 'react';
import { Controller, SubmitHandler, useFieldArray, useForm } from 'react-hook-form';

import DrawerSubmitAction from '@/components/Form/DrawerSubmitAction';
import InputComponent from '@/components/InputComponent';
import { useToast } from '@/components/ui/use-toast';

import { useInventoryPriceGroupsMutation } from '@/stores/managementStore/inventoryStore';

import { IGroupPriceObj, IInventory, IInventoryGroup, TGroupInventoryPriceFormObject } from '@/types/api/management/inventory';
import { TModalFormProps } from '@/types/modal';
import { ErrorMessageBackendDataShape } from '@/types/api';

import generateDynamicToastMessage from '@/utils/functions/generateDynamicToastMessage';
import generateStatusCodesMessage from '@/utils/functions/generateStatusCodesMessage';
import inventoryGroupPriceSchema from '@/utils/validations/management/inventory/inventoryGroupPriceSchema';
import { replaceInputTextToNumberOnly } from '@/utils/hooks/useReplaceInputTextToNumber';


const ManageGroupPriceForm = ({ toggle, data: inventoryGroupData }: TModalFormProps<IInventory>) => {
  const { toast } = useToast();

  const initialInventoryGroupMemo = useMemo<
    Partial<IInventoryGroup>[]
  >(() => {
    if (!inventoryGroupData) return [];
    const list = inventoryGroupData.group;
    const sanitizedData = list.map((item) => {
      return {
        groupId: item.id,
        name: item.name,
        price: item.price
      };
    });
    return sanitizedData;
  }, [inventoryGroupData]);

  const {
    control,
    handleSubmit,
    formState: { isDirty, isValid },
  } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: {
      inventoryGroupsPrice: initialInventoryGroupMemo ?? [],
    },
    resolver: yupResolver(inventoryGroupPriceSchema),
  });
  const {
    fields,
  } = useFieldArray({
    control,
    name: 'inventoryGroupsPrice',
  });

  const [inventoryPriceGroups, {isLoading: isLoadingInventoryPriceGroups}] = useInventoryPriceGroupsMutation();

   const handleSubmitData: SubmitHandler<
   TGroupInventoryPriceFormObject
  > = async (formData, event) => {
    if (!formData.inventoryGroupsPrice || !inventoryGroupData) return ;
    const submitData = {
      editedGroup: formData.inventoryGroupsPrice.map(({groupId, price}) => ({groupId, price}))
      }
    const formDataUpdate: IGroupPriceObj = { ...submitData };
    event?.preventDefault();
    await inventoryPriceGroups({id:inventoryGroupData.id, data: formDataUpdate})
      .unwrap()
      .then(() => {
        toast(
          generateDynamicToastMessage({
            title: 'Success',
            description: `Success manage pricelist groups`,
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
      }
    );
  };

  return (
    <form id="manageInventoryPriceGroup" onSubmit={handleSubmit(handleSubmitData)}>
      {fields.map((field, index) => (
        <div className="flex items-center gap-2 mb-4" key={field.id}>
          <div className="flex-1">
            <Controller
              name={`inventoryGroupsPrice.${index}.name`}
              control={control}
              render={({ field: { onChange, value } }) => (
                <InputComponent
                  value={value}
                  onChange={onChange}
                  disabled
                  placeholder="Name Group..."
                />
              )}
            />
          </div>
          <div className="flex flex-1 justify-center items-center gap-2">
            <Controller
              name={`inventoryGroupsPrice.${index}.price`}
              control={control}
              render={({ field: { onChange, value } }) => (
                <InputComponent
                value={value}
                onChange={onChange}
                placeholder="Price..."
                onInput={replaceInputTextToNumberOnly}
              />
              )}
            />
          </div>
        </div>
      ))}
      <DrawerSubmitAction
        toggle={toggle}
        submitText="Save Changes"
        disabled={!isDirty || !isValid || isLoadingInventoryPriceGroups}
        form="manageInventoryPriceGroup"
        cancelText="Cancel"
      />
    </form>
  );
};

export default ManageGroupPriceForm;
