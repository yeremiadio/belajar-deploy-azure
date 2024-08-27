import { FC } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';

import DrawerSubmitAction from '@/components/Form/DrawerSubmitAction';
import InputComponent from '@/components/InputComponent';
import { useToast } from '@/components/ui/use-toast';

import { useCreateProductionOutputMutation } from '@/stores/inventoryStore/workOrderStore/workOrderStoreApi';

import { ErrorMessageBackendDataShape } from '@/types/api';
import { TWorkOrderProductionLog } from '@/types/api/inventory/workOrder';

import generateDynamicToastMessage from '@/utils/functions/generateDynamicToastMessage';
import generateStatusCodesMessage from '@/utils/functions/generateStatusCodesMessage';
import workOrderProductionLogValidationSchema from '@/utils/validations/inventory/workOrderProductionLogValidationSchema';

type Props = {
  toggle: (open?: boolean) => void;
  productionUnit: string;
  id: number;
};

const ProductionOutputForm: FC<Props> = ({ productionUnit, id, toggle }) => {
  const { toast } = useToast();
  const [createProductionOutput, { isLoading }] =
    useCreateProductionOutputMutation();

  const form = useForm<Omit<TWorkOrderProductionLog, 'createdAt'>>({
    resolver: yupResolver(workOrderProductionLogValidationSchema),
    reValidateMode: 'onSubmit',
    mode: 'onBlur',
  });

  const handleSubmit = form.handleSubmit((data) => {
    createProductionOutput({
      id,
      productionOutput: Number(data.productionOutput),
      notGoodProductionOutput: Number(data.notGoodProductionOutput),
    })
      .unwrap()
      .then(() => {
        toast(
          generateDynamicToastMessage({
            title: 'Success',
            description: `Production is added successfully`,
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
  });

  return (
    <div className="flex flex-col gap-5">
      <Controller
        control={form.control}
        name="productionOutput"
        render={({
          field: { value, onChange, onBlur },
          fieldState: { error },
        }) => (
          <InputComponent
            label="Production Output"
            placeholder="Production Output"
            onChange={(e) => {
              const isNumber = !isNaN(e.target.valueAsNumber);
              if (isNumber) {
                onChange(e.target.valueAsNumber);
              } else {
                onChange(0);
              }
            }}
            onBlur={onBlur}
            min={0}
            type="number"
            value={value}
            additionalLabel={productionUnit}
            required
            errorMessage={error?.message}
          />
        )}
      />
      <span className="block w-full border-b border-rs-v2-thunder-blue" />
      <Controller
        control={form.control}
        name="notGoodProductionOutput"
        render={({
          field: { value, onChange, onBlur },
          fieldState: { error },
        }) => (
          <InputComponent
            label="Not Good Product"
            placeholder="Not Good Product"
            onChange={(e) => {
              const isNumber = !isNaN(e.target.valueAsNumber);
              if (isNumber) {
                onChange(e.target.valueAsNumber);
              } else {
                onChange(0);
              }
            }}
            onBlur={onBlur}
            min={0}
            type="number"
            value={value}
            additionalLabel={productionUnit}
            required
            errorMessage={error?.message}
          />
        )}
      />
      <DrawerSubmitAction
        submitText="Submit"
        toggle={toggle}
        type="button"
        onClick={handleSubmit}
        disabled={isLoading || !form.formState.isValid}
      />
    </div>
  );
};

export default ProductionOutputForm;
