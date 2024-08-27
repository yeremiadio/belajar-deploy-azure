import { useMemo, useRef } from 'react';
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
  useWatch,
} from 'react-hook-form';
import { MdDelete } from 'react-icons/md';
import { yupResolver } from '@hookform/resolvers/yup';

import DrawerSubmitAction from '@/components/Form/DrawerSubmitAction';
import InputComponent from '@/components/InputComponent';
import SelectComponent from '@/components/Select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

import { cn } from '@/lib/utils';
import {
  useBindMachineRecipesMutation,
  useEditBindMachineRecipeMutation,
} from '@/stores/managementStore/machineStore/machineStoreApi';

import { ErrorMessageBackendDataShape } from '@/types/api';
import {
  IMachine,
  IMachineRecipe,
  TBindRecipeMachineRequestFormObject,
} from '@/types/api/management/machine';
import { Nullable } from '@/types/global';
import { TModalFormProps } from '@/types/modal';

import generateDynamicToastMessage from '@/utils/functions/generateDynamicToastMessage';
import generateStatusCodesMessage from '@/utils/functions/generateStatusCodesMessage';
import useRecipeOpts from '@/utils/hooks/selectOptions/useRecipeOptions';
import { replaceInputTextToNumberOnly } from '@/utils/hooks/useReplaceInputTextToNumber';
import bindRecipesValidationSchema from '@/utils/validations/management/machine/bindRecipesValidationSchema';

const INITIAL_VALUE = { recipe: { label: '', value: null }, cycleRate: 0 };

type TModalBindRecipeFormProps = TModalFormProps<IMachine> & {
  selectedData?: IMachineRecipe;
};

const BindRecipeForm = ({
  toggle,
  data,
  isEditing,
  selectedData,
}: TModalBindRecipeFormProps) => {
  const divRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { arr: recipeOpts, isLoading: isLoadingRecipeOpts } = useRecipeOpts({
    isPaginated: false,
  });
  const [bindRecipe, { isLoading: isLoadingBindRecipe }] =
    useBindMachineRecipesMutation();
  const [editBindRecipe, { isLoading: isLoadingEditBindRecipe }] =
    useEditBindMachineRecipeMutation();
  const bindedRecipeMachineMemo = useMemo(() => {
    if (!data || data.machineRecipes.length === 0) return [INITIAL_VALUE];
    let existingData = [...data.machineRecipes];
    let mappedMachineRecipes: Array<{
      id?: number;
      recipe: {
        label: string;
        value: Nullable<number>;
      };
      cycleRate: number;
    }> = existingData.map((item) => {
      return {
        id: item.id,
        recipe: {
          label: item?.recipe?.name ?? '',
          value: item.recipeId,
        },
        cycleRate: item.cycleRate,
      };
    });
    mappedMachineRecipes.push(INITIAL_VALUE);
    if (isEditing) {
      const filteredEditData = mappedMachineRecipes.filter(
        (item) =>
          item.recipe.label.toLocaleLowerCase() ===
          selectedData?.recipe?.name.toLocaleLowerCase(),
      );
      return filteredEditData;
    } else {
      return mappedMachineRecipes;
    }
  }, [data, selectedData]);

  const { control, handleSubmit } =
    useForm<TBindRecipeMachineRequestFormObject>({
      defaultValues: {
        bindRecipes: bindedRecipeMachineMemo,
      },
      resolver: yupResolver(bindRecipesValidationSchema),
      mode: 'all',
      reValidateMode: 'onSubmit',
    });
  const values = useWatch({ control });

  /**
   * @description If bind recipe is only one value but not selected
   */
  const isFirstIndexRecipeEmpty =
    values?.bindRecipes &&
    values?.bindRecipes.length === 1 &&
    values?.bindRecipes.every((recipe) => !recipe.recipe?.value);

  const filteredRecipeOpts = useMemo(() => {
    const opts = [...recipeOpts];
    const inputValues = values.bindRecipes?.map((recipe) =>
      recipe?.recipe?.label?.toLocaleLowerCase(),
    );
    const filtered = opts.filter(
      (option) =>
        !inputValues?.some(
          (item) => item === option.label?.toString().toLocaleLowerCase(),
        ),
    );
    return filtered;
  }, [recipeOpts, values, values.bindRecipes]);

  const {
    fields,
    append: appendFieldArray,
    remove: removeFieldArray,
  } = useFieldArray({
    control,
    name: 'bindRecipes',
  });

  const handleSubmitData: SubmitHandler<
    TBindRecipeMachineRequestFormObject
  > = async (formData, event) => {
    event?.preventDefault();
    if (!data || !data.id) return;
    const filteredNotEmptyValues = formData?.bindRecipes?.filter(
      (item) => item.recipe.value !== null,
    );
    const sanitizedArrayRecipes = filteredNotEmptyValues?.map((item) => {
      return {
        id: item.id,
        recipeId: item.recipe?.value,
        cycleRate: item?.cycleRate ?? 0,
      };
    });
    if (isEditing) {
      if (!sanitizedArrayRecipes) return;
      await editBindRecipe({
        id: data.id,
        data: sanitizedArrayRecipes[0],
        bindRecipeId: sanitizedArrayRecipes[0]?.id,
      })
        .unwrap()
        .then(() => {
          toggle();
          toast(
            generateDynamicToastMessage({
              title: 'Success',
              description: 'Bind recipe edited successfully',
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
    } else {
      await bindRecipe({ id: data.id, data: sanitizedArrayRecipes })
        .unwrap()
        .then(() => {
          toggle();
          toast(
            generateDynamicToastMessage({
              title: 'Success',
              description: 'Recipe binded successfully',
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
    <form id="bindRecipeForm" onSubmit={handleSubmit(handleSubmitData)}>
      <p>
        To illustrate, Recipe [X] can result in 50 Kg of Product [A]. If a
        machine can process Recipe [X] two times in an hour, then the production
        rate for Product [A] would be 100 Kg/hour.
      </p>
      <div
        ref={divRef}
        className={cn(fields.length >= 3 && 'max-h-72 overflow-y-auto')}
      >
        {fields.map((field, index) => {
          const isLastIndex = index === fields.length - 1;
          return (
            <div className="my-4 flex items-center gap-2" key={field.id}>
              <div className="flex-1">
                <Controller
                  name={`bindRecipes.${index}.recipe`}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <SelectComponent
                      onChange={(value, option) => {
                        onChange(value, option);
                        const isLastIndex = index === fields.length - 1;
                        const isEmpty =
                          filteredRecipeOpts.length <= 1 && fields.length > 1;
                        if (!isEmpty && !isEditing && isLastIndex) {
                          appendFieldArray(INITIAL_VALUE);
                        }
                      }}
                      listHeight={180}
                      value={value}
                      label="Recipe"
                      labelInValue
                      loading={isLoadingRecipeOpts}
                      options={filteredRecipeOpts}
                      placeholder="Select Recipe"
                    />
                  )}
                />
              </div>
              <div className="flex flex-1 items-center justify-center gap-2">
                <Controller
                  name={`bindRecipes.${index}.cycleRate`}
                  control={control}
                  render={({
                    field: { onChange, value, onBlur },
                    fieldState: { error },
                  }) => {
                    return (
                      <InputComponent
                        label="Time production per 1 product"
                        placeholder="Time production per 1 product..."
                        onChange={onChange}
                        onBlur={onBlur}
                        onInput={(e) =>
                          replaceInputTextToNumberOnly(e, { isDecimal: true })
                        }
                        labelStyle="whitespace-nowrap"
                        value={value?.toString()}
                        errorMessage={error?.message}
                      />
                    );
                  }}
                />
                <p className="mt-6">hour</p>
              </div>
              {!isEditing ? (
                <Button
                  type="button"
                  disabled={isLastIndex}
                  onClick={() => {
                    const isEmpty = filteredRecipeOpts.length === 0;
                    removeFieldArray(index);
                    /**
                     * @summary This logic is an opposite from appendFieldArray
                     * onChange handler recipe
                     * @description CAUTION: useWatch from react-hook-form is delayed.
                     *
                     */
                    if (!!isEmpty) {
                      appendFieldArray(INITIAL_VALUE);
                    }
                  }}
                  className={cn(
                    'mt-6 w-9 bg-transparent p-[5px] text-rs-v2-red hover:bg-rs-v2-red hover:text-white disabled:cursor-default disabled:text-transparent',
                  )}
                >
                  <MdDelete size={24} />
                </Button>
              ) : null}
            </div>
          );
        })}
      </div>
      <DrawerSubmitAction
        toggle={toggle}
        submitText={isEditing ? 'Save Binding' : 'Bind Recipe'}
        disabled={
          isLoadingBindRecipe ||
          isLoadingEditBindRecipe ||
          /**
           * @todo REFACTOR SOON!
           */
          values?.bindRecipes
            ?.filter((item) => !!item.recipe?.value)
            .some((recipe) => !recipe.cycleRate || recipe.cycleRate < 1) ||
          isFirstIndexRecipeEmpty
        }
        form="bindRecipeForm"
        cancelText="Cancel"
      />
    </form>
  );
};

export default BindRecipeForm;
