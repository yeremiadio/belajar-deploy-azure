import { yupResolver } from '@hookform/resolvers/yup';
import dayjs from 'dayjs';
import { isEqual } from 'lodash';
import { useEffect } from 'react';
import { Controller, SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { FaCheck } from 'react-icons/fa6';

import { TriangleWarningIcon } from '@/assets/images/TriangleWarningIcon';

import DrawerSubmitAction from '@/components/Form/DrawerSubmitAction';
import InputComponent from '@/components/InputComponent';
import InputDatePickerComponent from '@/components/InputDatePickerComponent';
import SelectComponent from '@/components/Select';
import { useToast } from '@/components/ui/use-toast';

import { cn } from '@/lib/utils';

import { modalViewInventoryOpen } from '@/stores/inventoryStore/inventorySlice';
import {
  useCreateWorkOrderMutation,
  useUpdateWorkOrderMutation,
} from '@/stores/inventoryStore/workOrderStore/workOrderStoreApi';
import {
  useGetMachineRecipesDetailsQuery,
  useGetRecipesDetailsQuery,
} from '@/stores/managementStore/recipeStore';

import { ErrorMessageBackendDataShape } from '@/types/api';
import {
  IWorkOrderResponse,
  TWorkOrderRequestFormObject,
} from '@/types/api/inventory/workOrder';
import { TModalFormProps } from '@/types/modal';

import generateDynamicToastMessage from '@/utils/functions/generateDynamicToastMessage';
import generateStatusCodesMessage from '@/utils/functions/generateStatusCodesMessage';
import { removeEmptyObjects } from '@/utils/functions/removeEmptyObjects';
import useRecipeOpts from '@/utils/hooks/selectOptions/useRecipeOptions';
import useAppSelector from '@/utils/hooks/useAppSelector';
import usePrevious from '@/utils/hooks/usePrevious';
import workOrderValidationSchema from '@/utils/validations/management/workOrder/workOrderValidationSchema';


const WorkOrderForm = ({
  isEditing,
  toggle,
  id,
  data,
}: TModalFormProps<IWorkOrderResponse>) => {
  const { toast } = useToast();
  const isView = useAppSelector(modalViewInventoryOpen);
  const {
    control,
    handleSubmit,
    setValue,
    trigger,
    formState: { isDirty, isValid },
  } = useForm<TWorkOrderRequestFormObject>({
    defaultValues: {
      name: data?.name,
      recipe: data?.recipe?.id,
      targetProduction: data?.targetoutput,
      plannedTime: data?.targetrunning,
      scheduledDowntime: data?.downtime ?? 0,
      startDate: data?.startPlan
        ? new Date(String(data?.startPlan))
        : new Date(),
      endDate: data?.endPlan ? new Date(String(data?.endPlan)) : new Date(),
      machine: data?.machine?.id,
    },
    resolver: yupResolver(workOrderValidationSchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

  const formValues = useWatch({ control });

  const { data: recipeDetailsData } = useGetRecipesDetailsQuery(
    removeEmptyObjects({
      id: formValues.recipe && Number(formValues.recipe),
      targetProduction:
        formValues.targetProduction && Number(formValues.targetProduction),
    }),
    { skip: !formValues.recipe },
  );

  const { data: machineDetailsData } = useGetMachineRecipesDetailsQuery(
    {
      id: formValues.recipe ? Number(formValues.recipe) : 0,
    },
    { skip: !formValues.recipe },
  );

  const machineRecipeOpts =
    machineDetailsData?.machineRecipes.map((val) => {
      return {
        label: val.machine.name,
        value: val.machineId,
        ...val,
      };
    }) ?? [];

  const [createWorkOrder] = useCreateWorkOrderMutation();
  const [updateWorkOrder] = useUpdateWorkOrderMutation();
  const { arr: recipeOpts, isLoading: isLoadingRecipeOpts } = useRecipeOpts({
    isPaginated: false,
  });

  const handleSubmitData: SubmitHandler<TWorkOrderRequestFormObject> = async (
    data,
    event,
  ) => {
    event?.preventDefault();
    const {
      name,
      recipe,
      targetProduction,
      plannedTime,
      scheduledDowntime,
      startDate,
      endDate,
      machine,
    } = data;

    const handleWorkOrderApi = () => {
      const obj = {
        name,
        recipeId: recipe,
        targetoutput: targetProduction,
        targetrunning: plannedTime,
        downtime: scheduledDowntime,
        startPlan: startDate,
        endPlan: endDate,
        machineId: machine,
      };

      if (id) {
        return updateWorkOrder({
          id,
          data: {
            ...obj,
          },
        });
      } else {
        return createWorkOrder(obj);
      }
    };

    await handleWorkOrderApi()
      .unwrap()
      .then(() => {
        toast(
          generateDynamicToastMessage({
            title: 'Success',
            description: `Work Order is ${id ? 'updated' : 'added'} successfully`,
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
  const selectedMachineDetails =
    machineDetailsData?.machineRecipes &&
    machineDetailsData?.machineRecipes.find(
      (machine) => machine?.machineId === Number(formValues.machine),
    );

  const cycleRateNumber = selectedMachineDetails
    ? selectedMachineDetails?.cycleRate
    : 0;
  const targetNumber = formValues.targetProduction
    ? Number(formValues.targetProduction)
    : 0;
  const downtimeNumber = formValues.scheduledDowntime
    ? Number(formValues.scheduledDowntime)
    : 0;

  let minimumPlannedTime = 0;

  if (cycleRateNumber !== 0 && targetNumber !== 0 && formValues.plannedTime) {
    minimumPlannedTime = targetNumber / cycleRateNumber + downtimeNumber;
  } else {
    minimumPlannedTime = 0;
  }

  useEffect(() => {
    setValue('minPlannedTime', minimumPlannedTime);
    if (formValues.plannedTime) {
      trigger('plannedTime');
    }
  }, [minimumPlannedTime, formValues.plannedTime, setValue, trigger]);

  const prevStartDate = usePrevious(formValues.startDate);
  const prevPlannedTime = usePrevious(formValues.plannedTime);

  useEffect(() => {
    if (
      !isEqual(prevPlannedTime, formValues.plannedTime) ||
      !isEqual(prevStartDate, formValues.startDate)
    ) {
      if (formValues.startDate && formValues.plannedTime) {
        const formattedDate = dayjs(formValues.startDate)
          .add(formValues.plannedTime, 'hours')
          .toDate();
        setValue('endDate', new Date(String(formattedDate)));
      } else if (formValues.startDate && !formValues.plannedTime) {
        setValue('endDate', new Date(String(formValues.startDate)));
      }
    }
  }, [formValues.plannedTime, formValues.startDate]);

  useEffect(() => {
    if (data?.endPlan && isEditing) {
      setValue('endDate', new Date(String(data?.endPlan)));
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (value < 0) {
      e.target.value = ''; // Set input value to empty if it's less than 0
    }
  };

  const calculatedCycleRate =
    cycleRateNumber && recipeDetailsData?.output
      ? recipeDetailsData?.output / cycleRateNumber
      : 0;
  const cycleRateUnit = `${recipeDetailsData?.inventory.unit ?? 'Kg'}/hour`;
  const productName = formValues.recipe && recipeOpts.find((item) => item.id === formValues.recipe)?.inventory?.name 

  const startDate = new Date(String(formValues.startDate));
  const today = new Date();
  const maxDate = new Date(Math.max(startDate.getTime(), today.getTime()));

  return (
    <form id="workOrderForm" onSubmit={handleSubmit(handleSubmitData)}>
      <div className="gap-4 grid grid-cols-1 mb-6 max-h-[85vh] overflow-y-auto">
        <Controller
          name="name"
          control={control}
          render={({
            field: { onChange, value, onBlur },
            fieldState: { error },
          }) => {
            return (
              <InputComponent
                label="Work Order Name"
                placeholder="Type Work Order Name..."
                onChange={onChange}
                onBlur={onBlur}
                value={value}
                disabled={isView}
                required
                errorMessage={error?.message}
              />
            );
          }}
        />

        <Controller
          name="recipe"
          control={control}
          render={({ field: { onChange, value } }) => {
            return (
              <SelectComponent
                onChange={onChange}
                value={value}
                required
                label="Recipe"
                disabled={isView}
                placeholder="Select Recipe"
                loading={isLoadingRecipeOpts}
                options={recipeOpts}
                helperClassname="text-rs-v2-mint"
                helperText={
                  formValues.recipe
                    ? productName
                      ? `Product Name: ${productName}`
                      : ''
                    : ''
                }
              />
            );
          }}
        />

        <Controller
          name="targetProduction"
          control={control}
          render={({
            field: { onChange, value, onBlur },
            fieldState: { error },
          }) => {
            return (
              <InputComponent
                label="Target Production"
                placeholder="Type Target Production..."
                onChange={(e) => {
                  handleInputChange(e);
                  onChange(e);
                }}
                disabled={isView}
                onBlur={onBlur}
                min={0}
                type="number"
                value={value}
                additionalLabel={recipeDetailsData?.inventory?.unit ?? 'Kg'}
                required
                errorMessage={error?.message}
              />
            );
          }}
        />

        {formValues.targetProduction && formValues.recipe ? (
          recipeDetailsData?.recipeIngredients?.map((value, index) => (
            <>
            <div
              key={index}
              className="items-center grid grid-cols-12 grid-flow-row-dense bg-rs-v2-slate-blue border border-rs-v2-gunmetal-blue rounded-lg"
            >
              <div className="flex justify-start items-center col-span-4 px-4 py-3 border-r border-r-rs-v2-gunmetal-blue h-full text-left">
                {value?.inventory?.name}
              </div>
              <div className="flex justify-center items-center col-span-3 px-4 py-3 border-r border-r-rs-v2-gunmetal-blue h-full text-center">
                {value?.totalAmount} {value?.inventory?.unit}
              </div>
              <div className="flex justify-center items-center col-span-5 px-4 py-3 h-full text-center">
                <div
                  className={cn(
                    value?.isReady
                      ? 'rounded-[50px] bg-rs-alert-green-30% px-3 py-1 text-sm text-rs-alert-green'
                      : 'flex items-center rounded-[50px] bg-rs-v2-red-60% px-3 py-1 text-xs text-rs-v2-red'
                  )}
                >
                  {value?.isReady ? (
                    <div className="flex items-center">
                      <div className="mr-2">Stock Ready</div> <FaCheck />
                    </div>

                  ) : (
                    <>
                      <div className="mr-2">Stock Not Enough</div>{' '}
                      <TriangleWarningIcon />
                    </>
                  )}
                </div>

              </div>
            </div><p className='mt-[-5px] font-light text-rs-v2-mint text-xs'>{`Total stock: ${value?.inventory?.stock} ${value?.inventory?.unit}`}</p></>
          ))
         
        ) : (
          <></>
        )}

        <Controller
          name="machine"
          control={control}
          render={({ field: { onChange, value }, fieldState: { error } }) => {
            return (
              <SelectComponent
                onChange={onChange}
                value={value}
                required
                label="Machine"
                disabled={isView}
                helperClassname="text-rs-v2-mint"
                helperText={
                  formValues.machine
                    ? calculatedCycleRate
                      ? `Cycle Rate: ${calculatedCycleRate} ${cycleRateUnit}`
                      : ''
                    : ''
                }
                placeholder="Select Machine"
                errorMessage={error?.message}
                notFoundContent={'No machine can process selected recipe'}
                options={machineRecipeOpts}
              />
            );
          }}
        />

        <Controller
          name="plannedTime"
          control={control}
          render={({
            field: { onChange, value, onBlur },
            fieldState: { error },
          }) => {
            return (
              <InputComponent
                label="Target Planned Time"
                placeholder="Type Planned Time..."
                onBlur={onBlur}
                type="number"
                disabled={isView}
                min={0}
                helperClassname="text-rs-v2-mint"
                onChange={(e) => {
                  handleInputChange(e);
                  onChange(e);
                }}
                helperText={
                  minimumPlannedTime !== 0
                    ? `Minimum Planned Time: ${minimumPlannedTime} hours`
                    : ''
                }
                value={value}
                required
                errorMessage={error?.message}
                additionalLabel="hours"
              />
            );
          }}
        />

        <Controller
          name="scheduledDowntime"
          control={control}
          render={({
            field: { onChange, value, onBlur },
            fieldState: { error },
          }) => {
            return (
              <InputComponent
                label="Scheduled Downtime"
                placeholder="Type Scheduled Downtime..."
                onBlur={onBlur}
                disabled={isView}
                onChange={(e) => {
                  handleInputChange(e);
                  onChange(e);
                }}
                type="number"
                min={0}
                value={value}
                additionalLabel="hours"
                required
                errorMessage={error?.message}
              />
            );
          }}
        />

        <div className="gap-4 grid grid-cols-2">
          <Controller
            name="startDate"
            control={control}
            render={({ field: { onChange, value } }) => {
              return (
                <InputDatePickerComponent
                  label="Start Date Planned"
                  value={value}
                  disabled={isView}
                  required
                  disabledCalendar={{ before: new Date() }}
                  onChange={onChange}
                />
              );
            }}
          />
          <Controller
            name="endDate"
            control={control}
            render={({ field: { onChange, value } }) => {
              return (
                <InputDatePickerComponent
                  label="End Date Planned"
                  value={value}
                  disabled={isView}
                  required
                  disabledCalendar={{
                    before: maxDate,
                  }}
                  onChange={onChange}
                />
              );
            }}
          />
        </div>
      </div>
      {!isView ? (
        <DrawerSubmitAction
          submitText={isEditing ? 'Edit Work Order' : 'Add Work Order'}
          disabled={!isDirty || !isValid}
          toggle={toggle}
          form="workOrderForm"
        />
      ) : null}
    </form>
  );
};

export default WorkOrderForm;
