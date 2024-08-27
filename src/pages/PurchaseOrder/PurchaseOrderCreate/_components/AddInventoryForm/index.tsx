import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';

import convertNumberToStringRupiah from '@/utils/functions/convertNumberToStringRupiah';
import useInventoryOptions from '@/utils/hooks/selectOptions/useInventoryOptions';

import { TModalFormProps } from '@/types/modal';
import {
  TInventoryItem,
  TPurchaseOrderRequestFormObject,
} from '@/types/api/order';
import { IInventory } from '@/types/api/management/inventory';

import DrawerSubmitAction from '@/components/Form/DrawerSubmitAction';
import InputComponent from '@/components/InputComponent';
import SelectComponent from '@/components/Select';

interface Props extends TModalFormProps<any> {
  orderFormObject: UseFormReturn<TPurchaseOrderRequestFormObject>;
  isEditing?: boolean;
  currentInventory?: TInventoryItem<IInventory>;
}

const AddInventoryForm = ({
  toggle,
  orderFormObject,
  isEditing,
  currentInventory,
}: Props) => {
  const defaultValueSelectedInventory = currentInventory?.inventory
    ? {
        ...currentInventory.inventory,
        value: currentInventory.inventory.id,
        label: `${currentInventory.inventory.uniqueId} - ${currentInventory.inventory.name}`,
      }
    : undefined;

  const [selectedInventory, setSelectedInventory] = useState<
    IInventory | undefined
  >(defaultValueSelectedInventory);
  const [quantity, setQuantity] = useState<any>(
    currentInventory?.quantity || 1,
  );
  const { watch, getValues, setValue } = orderFormObject;

  const { data: inventoryOpt } = useInventoryOptions();

  const selectPriceByGroup = (inventory: IInventory) => {
    const groupInventoryId = watch('groupInventoryId');
    const group = inventory.group?.find(
      (group) => group.id === groupInventoryId,
    );
    return group?.price || inventory.price || 0;
  };

  const currentInventoryList = getValues('inventoryList') || [];

  const handleUpdateInventory = () => {
    if (selectedInventory) {
      const existingInventoryIndex = currentInventoryList.findIndex(
        (item) => item.id === selectedInventory.id,
      );

      const filteredPrice = selectPriceByGroup(selectedInventory);
      const newInventory: TInventoryItem<IInventory> = {
        id: selectedInventory.id,
        quantity: Number(quantity),
        inventory: {
          ...selectedInventory,
          price: filteredPrice,
        },
      };

      if (existingInventoryIndex !== -1) {
        setValue('inventoryList', [
          ...currentInventoryList.slice(0, existingInventoryIndex),
          newInventory,
          ...currentInventoryList.slice(existingInventoryIndex + 1),
        ]);
      }

      toggle();
    }
  };

  const handleAddInventory = () => {
    if (selectedInventory) {
      const existingInventoryIndex = currentInventoryList.findIndex(
        (item) => item.id === selectedInventory.id,
      );

      const filteredPrice = selectPriceByGroup(selectedInventory);
      const newInventory: TInventoryItem<IInventory> = {
        id: selectedInventory.id,
        quantity: Number(quantity),
        inventory: {
          ...selectedInventory,
          price: filteredPrice,
        },
      };

      if (existingInventoryIndex === -1) {
        setValue('inventoryList', [...currentInventoryList, newInventory]);
      }

      toggle();
    }
  };

  return (
    <>
      <SelectComponent
        id="inventoryIdSelect"
        label="Inventory ID - Name"
        placeholder="Select Inventory ID - Name"
        onChange={(value) => {
          const selected = inventoryOpt.find(
            (option) => option.value === value,
          );
          if (selected) {
            setSelectedInventory(selected);
          } else {
            setSelectedInventory(undefined);
          }
        }}
        value={selectedInventory}
        options={inventoryOpt.filter(
          (option) =>
            !currentInventoryList.some(
              (inventoryItem) => inventoryItem.id === option.value,
            ),
        )}
        disabled={isEditing}
      />
      <div className="grid grid-cols-2 gap-4">
        <InputComponent
          id="unitInput"
          label="Unit"
          placeholder="Unit"
          value={selectedInventory?.unit || ''}
          disabled={true}
        />
        <InputComponent
          id="priceInput"
          label="Price per Unit"
          placeholder="Rp 0"
          value={convertNumberToStringRupiah(
            selectedInventory ? selectPriceByGroup(selectedInventory) : 0,
          )}
          disabled={true}
        />
        <InputComponent
          id="quantityInput"
          label="Quantity"
          placeholder="Quantity"
          type="number"
          onChange={(e) => {
            const value = e.target.value;
            setQuantity(value === '' ? '' : Number(value));
          }}
          value={quantity}
        />
        <InputComponent
          id="totalPriceInput"
          label="Total Price per Product"
          placeholder="Rp 0"
          value={
            selectedInventory
              ? convertNumberToStringRupiah(
                  quantity * (selectPriceByGroup(selectedInventory) || 0),
                )
              : convertNumberToStringRupiah(0)
          }
          disabled={true}
        />
      </div>
      <DrawerSubmitAction
        toggle={toggle}
        submitText={isEditing ? 'Save Changes' : 'Add Inventory'}
        disabled={!selectedInventory || quantity < 1}
        onClick={isEditing ? handleUpdateInventory : handleAddInventory}
        cancelText="Cancel"
      />
    </>
  );
};

export default AddInventoryForm;
