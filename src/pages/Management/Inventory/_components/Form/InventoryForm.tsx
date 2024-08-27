import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import DrawerSubmitAction from "@/components/Form/DrawerSubmitAction";
import InputComponent from "@/components/InputComponent";
import SelectComponent from "@/components/Select";
import Spinner from "@/components/Spinner";
import { useToast } from "@/components/ui/use-toast";

import { useCreateInventoryMutation, useUpdateInventoryMutation } from "@/stores/managementStore/inventoryStore";

import { ErrorMessageBackendDataShape } from "@/types/api";
import { IInventory, TInventoryRequestFormObject } from "@/types/api/management/inventory";
import { TModalFormProps } from "@/types/modal";

import unitOptionsDummy from "@/utils/dummies/reservation/unitOptionsDummy";
import generateDynamicToastMessage from "@/utils/functions/generateDynamicToastMessage";
import generateStatusCodesMessage from "@/utils/functions/generateStatusCodesMessage";
import isFieldRequired from "@/utils/functions/isFieldRequired";
import useInventoryTypeOpts from "@/utils/hooks/selectOptions/useInventoryTypeOptions";
import inventoryValidationSchema from "@/utils/validations/management/inventory/inventoryValidationSchema";
import { replaceInputTextToNumberOnly } from "@/utils/hooks/useReplaceInputTextToNumber";



const InventoryForm = ({
    data,
    isEditing,
    toggle,
  }: TModalFormProps<IInventory>) => {
    const { toast } = useToast();
    const {
      control,
      handleSubmit,
      formState: { isDirty, isValid },
    } = useForm<TInventoryRequestFormObject>({
      defaultValues: {
        uniqueId: data?.uniqueId ?? "",
        name: data?.name ?? "",
        type: data?.type ?? undefined,
        unit: data?.unit ?? undefined,
        price: data?.price ?? undefined,
      },
      resolver: yupResolver(inventoryValidationSchema),
      mode: 'onBlur',
      reValidateMode: 'onBlur',
    });

    const [createInventory, { isLoading: isCreatingInventory }] =
    useCreateInventoryMutation();

  const [updateInventory, { isLoading: isEditingInventory }] =
    useUpdateInventoryMutation();

  const { arr: inventoryTypeOptions, isLoading: isLoadingInventoryTypeOptions } =
    useInventoryTypeOpts(
      { isPaginated: false },
    );

  const isRequired = (fieldName: keyof TInventoryRequestFormObject): boolean => {
    const value = isFieldRequired<TInventoryRequestFormObject>(
      inventoryValidationSchema,
      fieldName,
    );
    return value;
  };
    const handleSubmitItem: SubmitHandler<TInventoryRequestFormObject> = async (
      formData,
      event,
    ) => {
      event?.preventDefault();
      const baseFormData = {
        uniqueId: formData?.uniqueId ?? "",
        name: formData?.name ?? "",
        type: formData?.type ?? "",
        unit: formData?.unit ?? "",
        price: formData?.price ?? undefined,
      };
      if (isEditing) {
        if (!data?.id || !formData) return;
        const formDataUpdate: Partial<IInventory> = { ...baseFormData };
        await updateInventory({ id: data?.id, data: formDataUpdate })
          .unwrap()
          .then(() => {
            toggle();
            toast(
              generateDynamicToastMessage({
                title: 'Success',
                description: 'Inventory updated successfully',
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
        const formDataCreate: Partial<IInventory> = {
          ...baseFormData,
        };
        await createInventory({ ...formDataCreate })
          .unwrap()
          .then(() => {
            toggle();
            toast(
              generateDynamicToastMessage({
                title: 'Success',
                description: 'Inventory created successfully',
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
    className="gap-4 grid grid-cols-1"
    id="inventoryForm" onSubmit={handleSubmit(handleSubmitItem)}>
          <Controller
            name="uniqueId"
            control={control}
            render={({
              field: { onChange, value, onBlur },
              fieldState: { error },
            }) => {
              return (
                <InputComponent
                  label="Inventory ID"
                  placeholder="Inventory ID"
                  onChange={onChange}
                  onBlur={onBlur}
                  required={isRequired('uniqueId')}
                  value={value}
                  errorMessage={error?.message}
                />
              );
            }}
          />
          <Controller
            name="name"
            control={control}
            render={({
              field: { onChange, value, onBlur },
              fieldState: { error },
            }) => {
              return (
                <InputComponent
                  label="Inventory Name"
                  placeholder="Inventory Name"
                  required={isRequired('name')}
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                  errorMessage={error?.message}
                />
              );
            }}
          />
      <Controller
        name="type"
        control={control}
        render={({
          field: { onChange, value },
          fieldState: { error },
        }) => {
          return (
            <SelectComponent
              onChange={onChange}
              value={value}
              label="Inventory Type"
              required={isRequired('type')}
              placeholder="Inventory Type..."
              errorMessage={error?.message}
              isError={!!error?.message}
              loading={isLoadingInventoryTypeOptions}
              options={inventoryTypeOptions}
            />
          );
        }}
      />
       <Controller
        name="unit"
        control={control}
        render={({
          field: { onChange, value },
          fieldState: { error },
        }) => {
          return (
            <SelectComponent
              onChange={onChange}
              value={value}
              label="Unit Measurement"
              required={isRequired('unit')}
              placeholder="Unit Measurement..."
              errorMessage={error?.message}
              isError={!!error?.message}
              options={unitOptionsDummy}
            />
          );
        }}
      />
      <Controller
        name="price"
        control={control}
        render={({
          field: { onChange, value, onBlur },
          fieldState: { error },
        }) => {
          return (
            <InputComponent
              label="Default Price"
              placeholder="Default Price"
              onChange={onChange}
              onBlur={onBlur}
              required
              onInput={replaceInputTextToNumberOnly}
              value={value}
              errorMessage={error?.message}
            />
          );
        }}
      />
      <DrawerSubmitAction
        submitText={
          isCreatingInventory || isEditingInventory ? (
            <Spinner size={18} borderWidth={1.5} isFullWidthAndHeight />
          ) : isEditing ? (
            'Save Changes'
          ) : (
            'Add Inventory'
          )
        }
        disabled={!isDirty || !isValid}
        toggle={toggle}
        form="inventoryForm"
      />
    </form>
  );
};

export default InventoryForm