import { yupResolver } from '@hookform/resolvers/yup';
import { FC, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

import DrawerSubmitAction from '@/components/Form/DrawerSubmitAction';
import InputComponent from '@/components/InputComponent';
import InputDatePickerComponent from '@/components/InputDatePickerComponent';
import InputRadioGroup from '@/components/InputRadioGroup';
import SelectComponent from '@/components/Select';
import { useToast } from '@/components/ui/use-toast';

import {
  useCreateInventoryTransactionMutation,
  useGetInventoryQuery,
  useUpdateInventoryTransactionMutation,
} from '@/stores/managementStore/inventoryStore';

import { ErrorMessageBackendDataShape } from '@/types/api';
import {
  TInventoryTransaction,
  TInventoryTransactionRequestObject,
} from '@/types/api/inventory';
import { IInventory } from '@/types/api/management/inventory';

import generateDynamicToastMessage from '@/utils/functions/generateDynamicToastMessage';
import generateStatusCodesMessage from '@/utils/functions/generateStatusCodesMessage';
import inOutStockValidationSchema from '@/utils/validations/inventory/inOutStockValidationSchema';

type Props = {
  toggle: (open?: boolean | undefined) => void;
  inventory?: IInventory;
  transaction?: TInventoryTransaction;
};

const TransactionForm: FC<Props> = ({ toggle, transaction, inventory }) => {
  const [createInventoryTransaction] = useCreateInventoryTransactionMutation();
  const [updateInventoryTransaction] = useUpdateInventoryTransactionMutation();
  const { data: inventoryData, isLoading: inventoryDataLoading } =
    useGetInventoryQuery({
      isPaginated: false,
    });

  const inventoryDataOptions = inventoryData?.entities?.map((item) => ({
    label: `${item.uniqueId} - ${item.name}`,
    value: item.id,
  }));

  const transactionForm = useForm<TInventoryTransactionRequestObject>({
    resolver: yupResolver(inOutStockValidationSchema),
    reValidateMode: 'onBlur',
    mode: 'onBlur',
    defaultValues: {
      date: undefined,
      type: '',
      inventoryId: undefined,
      name: '',
      stock: undefined,
    },
  });

  const inventoryIdWatch = transactionForm.watch('inventoryId');
  const stockWatch = transactionForm.watch('stock');
  const typeWatch = transactionForm.watch('type');
  const maxStockInventory = inventoryData?.entities?.find(
    (item) => item?.id?.toString() === inventoryIdWatch?.toString(),
  )?.stock;
  const stockLimit =
    stockWatch > (maxStockInventory ?? 0) && typeWatch === 'OUT';

  useEffect(() => {
    if (transaction) {
      transactionForm.reset(transaction);
    }

    if (inventory) {
      transactionForm.setValue(
        'inventoryId',
        inventory.id as unknown as string,
      );
    }
  }, [transaction]);

  const { toast } = useToast();

  const createTransaction = async (
    formData: TInventoryTransactionRequestObject,
  ) => {
    await createInventoryTransaction(formData)
      .unwrap()
      .then(() => {
        toggle();
        transactionForm.reset();
        toast(
          generateDynamicToastMessage({
            title: 'Success',
            description: 'Transaction added successfully',
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
  };

  const updateTransaction = async (
    formData: TInventoryTransactionRequestObject,
  ) => {
    if (!transaction?.id) return;

    await updateInventoryTransaction({
      ...formData,
      transactionId: transaction?.id,
    })
      .unwrap()
      .then(() => {
        toggle();
        transactionForm.reset();
        toast(
          generateDynamicToastMessage({
            title: 'Success',
            description: 'Transaction updated successfully',
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
  };

  const isEdit = !!transaction;

  return (
    <form
      id="inOutStockForm"
      onSubmit={transactionForm.handleSubmit(
        isEdit ? updateTransaction : createTransaction,
      )}
      className="flex flex-col gap-4"
    >
      <Controller
        name="date"
        control={transactionForm.control}
        render={({
          field: { value, onChange, onBlur },
          fieldState: { error },
        }) => (
          <InputDatePickerComponent
            label="Date"
            placeholder="Select Date"
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            disabledCalendar={{ before: new Date() }}
            required
            errorMessage={error?.message}
          />
        )}
      />
      <Controller
        name="type"
        control={transactionForm.control}
        render={({
          field: { onChange, value, onBlur },
          fieldState: { error },
        }) => (
          <InputRadioGroup
            label="Type"
            gap={5}
            value={value}
            onBlur={onBlur}
            onChange={(value) => onChange(value)}
            errorMessage={error?.message}
            required
            options={[
              {
                label: 'In',
                value: 'IN',
              },
              {
                label: 'Out',
                value: 'OUT',
              },
            ]}
          />
        )}
      />
      <Controller
        name="inventoryId"
        control={transactionForm.control}
        render={({
          field: { onChange, value, onBlur },
          fieldState: { error },
        }) => (
          <SelectComponent
            label="Inventory"
            placeholder="Select Inventory ID - Name"
            value={value}
            disabled={isEdit}
            onBlur={onBlur}
            errorMessage={error?.message}
            loading={inventoryDataLoading}
            onChange={onChange}
            required
            options={inventoryDataOptions}
          />
        )}
      />
      <Controller
        name="name"
        control={transactionForm.control}
        render={({
          field: { onChange, value, onBlur },
          fieldState: { error },
        }) => (
          <InputComponent
            label="Transaction"
            placeholder="Transaction Name"
            value={value}
            onBlur={onBlur}
            required
            errorMessage={error?.message}
            onChange={onChange}
          />
        )}
      />
      <Controller
        name="stock"
        control={transactionForm.control}
        render={({
          field: { onChange, value, onBlur },
          fieldState: { error },
        }) => (
          <InputComponent
            label="Qty"
            placeholder="Qty"
            type="number"
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            required
            helperText={
              typeWatch === 'OUT'
                ? `Max Stock: ${maxStockInventory ?? ''}`
                : undefined
            }
            helperClassname="text-rs-v2-mint"
            errorMessage={
              error?.message || (stockLimit ? 'Stock limit exceeded' : '')
            }
          />
        )}
      />
      <DrawerSubmitAction
        submitText={isEdit ? 'Save Changes' : 'Add Transaction'}
        toggle={toggle}
        form="inOutStockForm"
        disabled={stockLimit}
      />
    </form>
  );
};

export default TransactionForm;
