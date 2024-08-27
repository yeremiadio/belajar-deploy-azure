import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
  useWatch,
} from 'react-hook-form';

import DrawerSubmitAction from '@/components/Form/DrawerSubmitAction';
import InputComponent from '@/components/InputComponent';
import SelectComponent from '@/components/Select';
import Spinner from '@/components/Spinner';
import { toast } from '@/components/ui/use-toast';
import {
  useCreateRecipeMutation,
  useUpdateRecipeMutation,
} from '@/stores/managementStore/recipeStore';
import { ErrorMessageBackendDataShape } from '@/types/api';
import {
  IRecipeObjResponse,
  TRecipeRequestFormObject,
} from '@/types/api/management/recipe';
import { TModalFormProps } from '@/types/modal';
import generateDynamicToastMessage from '@/utils/functions/generateDynamicToastMessage';
import generateStatusCodesMessage from '@/utils/functions/generateStatusCodesMessage';
import recipeValidationSchema from '@/utils/validations/management/recipe/recipeValidationSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import useInventoryOpts from '@/utils/hooks/selectOptions/useInventoryOptions';
import { MdDelete } from 'react-icons/md';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';

export const RecipeForm = ({
  data,
  toggle,
  isEditing,
  isAddIngredients,
}: TModalFormProps<IRecipeObjResponse> & {
  isAddIngredients?: boolean;
}) => {
  const INITIAL_SELECT_VALUE = { label: '', value: null };
  const INITIAL_ARR_VALUE = {
    inventoryId: INITIAL_SELECT_VALUE,
    amount: 0,
  };
  const { data: inventoryOpts } = useInventoryOpts();

  const [createRecipe, { isLoading: isCreatingRecipe }] =
    useCreateRecipeMutation();

  const [updateRecipe, { isLoading: isUpdatingRecipe }] =
    useUpdateRecipeMutation();

  const inventoryIdMemo = useMemo(() => {
    if (!data || !data.inventory || !isEditing) return undefined;

    return {
      label: data?.inventory?.name,
      value: data?.inventory?.id,
    };
  }, [data]);

  const recipeIngredientsMemo = useMemo(() => {
    if (!data || data.recipeIngredients.length === 0 || !isEditing)
      return [INITIAL_ARR_VALUE];

    const recipeIngredientsArr = data.recipeIngredients.filter(
      (item) => item.inventory,
    );
    const existingData = [...recipeIngredientsArr];
    const mappedRecipeIngredients = existingData.map((item) => {
      return {
        inventoryId: { label: item.inventory.name, value: item.inventoryId },
        amount: item.amount,
      };
    });

    return [...mappedRecipeIngredients, INITIAL_ARR_VALUE];
  }, [data]);

  const { control, handleSubmit } = useForm<TRecipeRequestFormObject>({
    defaultValues: {
      name: data?.name ?? '',
      inventoryId: inventoryIdMemo,
      output: data?.output ?? 0,
      recipeIngredients: recipeIngredientsMemo,
    },
    resolver: yupResolver(recipeValidationSchema),
    mode: 'all',
    reValidateMode: 'onSubmit',
  });
  const values = useWatch({ control });

  const filteredInventoryOpts = useMemo(() => {
    const opts = [...inventoryOpts];

    const selectedIngredients = values?.recipeIngredients?.map(
      (val) => val?.inventoryId?.value,
    );

    const filtered = opts.filter(
      (option) =>
        !selectedIngredients?.some((item) => item == option.value) &&
        values?.inventoryId?.value !== option.value,
    );
    return filtered;
  }, [inventoryOpts, values, values.inventoryId, values.recipeIngredients]);

  const selectedUnitInventory = (val: number | undefined | null) => {
    if (!val || val === null) return '';
    const data = inventoryOpts.find((item) => item.id === val)?.unit;
    return data;
  };

  const {
    fields,
    append: appendFieldArray,
    remove: removeFieldArray,
  } = useFieldArray({
    control,
    name: 'recipeIngredients',
  });

  const handleSubmitData: SubmitHandler<TRecipeRequestFormObject> = async (
    formData,
    event,
  ) => {
    event?.preventDefault();

    const filteredNotEmptyArrRecipeIngredientsValues =
      formData?.recipeIngredients?.filter(
        (item) => item.inventoryId.value !== null,
      );
    const sanitizedArrayIngredients =
      filteredNotEmptyArrRecipeIngredientsValues?.map((item) => {
        return {
          inventoryId: item.inventoryId.value,
          amount: item.amount,
        };
      });

    if (isEditing) {
      if (!data || !data?.id) return;
      await updateRecipe({
        id: data?.id,
        data: {
          ...formData,
          inventoryId: formData.inventoryId.value,
          recipeIngredients: sanitizedArrayIngredients,
        },
      })
        .unwrap()
        .then(() => {
          toggle();
          toast(
            generateDynamicToastMessage({
              title: 'Success',
              description: 'Recipe updated successfully',
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
      await createRecipe({
        ...formData,
        inventoryId: formData.inventoryId.value,
        recipeIngredients: sanitizedArrayIngredients,
      })
        .unwrap()
        .then(() => {
          toggle();
          toast(
            generateDynamicToastMessage({
              title: 'Success',
              description: 'Recipe created successfully',
              variant: 'success',
            }),
          );
        })
        .catch((error: ErrorMessageBackendDataShape) => {
          toast(
            generateDynamicToastMessage({
              title: 'Failed',
              description: `Failed creating recipe ${error?.data?.message ?? ''}`,
              variant: 'error',
            }),
          );
        });
    }
  };

  /**
   * @function isIngredientsIndexEmpty handleSubmit
   * @description If ingredients is only one value but not selected
   */
  const isFirstIndexIngredientsEmpty =
    values?.recipeIngredients &&
    values?.recipeIngredients.length === 1 &&
    values?.recipeIngredients.every((item) => !item.inventoryId?.value);

  /**
   * @constant isAllRecipeNotValid handleSubmit
   * @description If all recipe is not valid
   */
  const isAllRecipeNotValid =
    !values.name || !values.inventoryId?.value || !values.output;

  /**
   * @constant isAllIngredientsNotValid handleSubmit
   * @description If all ingredients is not valid
   */
  const isAllIngredientsNotValid = values?.recipeIngredients
    ?.filter((item) => item.inventoryId?.value !== null)
    .some((item) => !item.amount || item.amount <= 0);

  return (
    <form id="recipeForm" onSubmit={handleSubmit(handleSubmitData)}>
      <div className="mb-6 grid max-h-[70vh] grid-cols-1 gap-4 overflow-y-auto">
        {!isAddIngredients && (
          <>
            <Controller
              name="name"
              control={control}
              render={({
                field: { onChange, value, onBlur },
                fieldState: { error },
              }) => {
                return (
                  <InputComponent
                    label="Recipe's Name"
                    placeholder="Recipe's Name"
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    required
                    errorMessage={error?.message}
                  />
                );
              }}
            />

            <Controller
              name="inventoryId"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => {
                return (
                  <SelectComponent
                    label="Inventory"
                    placeholder="Select Inventory"
                    options={filteredInventoryOpts}
                    onChange={(value, option) => {
                      onChange(value, option);
                    }}
                    value={value}
                    labelInValue
                    required
                    errorMessage={error?.message}
                  />
                );
              }}
            />

            <Controller
              name="output"
              control={control}
              render={({
                field: { onChange, value, onBlur },
                fieldState: { error },
              }) => {
                return (
                  <InputComponent
                    label="Production Output"
                    placeholder="Production Output"
                    onChange={onChange}
                    onBlur={onBlur}
                    type="number"
                    value={value}
                    additionalLabel={selectedUnitInventory(
                      values.inventoryId?.value,
                    )}
                    required
                    errorMessage={error?.message}
                  />
                );
              }}
            />

            <hr className="my-8 h-1 w-full bg-rs-neutral-dark-platinum" />

            <span className="mb-4 text-lg font-semibold">Ingredients</span>
          </>
        )}

        {fields.map((field, index) => {
          const isLastIndex = index === fields.length - 1;
          return (
            <div className="flex items-start gap-2" key={field.id}>
              <div className="flex-[2]">
                <Controller
                  name={`recipeIngredients.${index}.inventoryId`}
                  control={control}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <SelectComponent
                      label="Inventory"
                      placeholder="Select Inventory"
                      options={filteredInventoryOpts}
                      onChange={(value, option) => {
                        onChange(value, option);
                        const isEmpty = filteredInventoryOpts.length <= 1;
                        if (!isEmpty && isLastIndex) {
                          appendFieldArray(INITIAL_ARR_VALUE);
                        }
                      }}
                      value={value}
                      labelInValue
                      required
                      errorMessage={error?.message}
                    />
                  )}
                />
              </div>

              <div className="flex flex-1 items-start justify-center gap-2">
                <Controller
                  name={`recipeIngredients.${index}.amount`}
                  control={control}
                  render={({
                    field: { onChange, value, onBlur },
                    fieldState: { error },
                  }) => {
                    return (
                      <InputComponent
                        label="Amount"
                        placeholder="Amount"
                        onChange={onChange}
                        onBlur={onBlur}
                        type="number"
                        value={value}
                        required
                        errorMessage={error?.message}
                      />
                    );
                  }}
                />
                <p className="mt-9 w-[24px]">
                  {values.recipeIngredients &&
                    selectedUnitInventory(
                      values.recipeIngredients[index]?.inventoryId?.value,
                    )}
                </p>
              </div>

              <Button
                type="button"
                disabled={isLastIndex}
                onClick={() => {
                  removeFieldArray(index);
                  /**
                   * @summary This logic is an opposite from appendFieldArray
                   * onChange handler inventoryId
                   * @description CAUTION: useWatch from react-hook-form is delayed.
                   *
                   */
                  const isEmpty = filteredInventoryOpts.length === 0;
                  if (isEmpty) {
                    appendFieldArray(INITIAL_ARR_VALUE);
                  }
                }}
                className={cn(
                  'mt-7 w-9 bg-transparent p-[5px] text-rs-v2-red hover:bg-rs-v2-red hover:text-white disabled:cursor-default disabled:text-transparent',
                )}
              >
                <MdDelete size={24} />
              </Button>
            </div>
          );
        })}
      </div>

      <DrawerSubmitAction
        toggle={toggle}
        submitText={
          isCreatingRecipe || isUpdatingRecipe ? (
            <Spinner size={18} borderWidth={1.5} isFullWidthAndHeight />
          ) : isAddIngredients ? (
            'Add Ingredients'
          ) : isEditing ? (
            'Save Changes'
          ) : (
            'Add Recipe'
          )
        }
        disabled={
          isCreatingRecipe ||
          isUpdatingRecipe ||
          isAllIngredientsNotValid ||
          isFirstIndexIngredientsEmpty ||
          (!isAddIngredients && isAllRecipeNotValid)
        }
        form="recipeForm"
        cancelText="Cancel"
      />
    </form>
  );
};
