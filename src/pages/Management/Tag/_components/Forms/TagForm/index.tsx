import { Controller, useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';

import DrawerSubmitAction from '@/components/Form/DrawerSubmitAction';
import InputComponent from '@/components/InputComponent';
import SelectComponent from '@/components/Select';
import { useToast } from '@/components/ui/use-toast';

import { TModalFormProps } from '@/types/modal';
import { ErrorMessageBackendDataShape } from '@/types/api';

import {
  ITagObjResponse,
  TTagRequestFormObject,
} from '@/types/api/management/tag';

import { removeEmptyObjects } from '@/utils/functions/removeEmptyObjects';
import useCompanyOpts from '@/utils/hooks/selectOptions/useCompanyOptions';
import generateDynamicToastMessage from '@/utils/functions/generateDynamicToastMessage';
import generateStatusCodesMessage from '@/utils/functions/generateStatusCodesMessage';
import useUserType from '@/utils/hooks/auth/useUserType';
import tagValidationSchema from '@/utils/validations/management/tag/tagValidationSchema';

import {
  useCreateTagMutation,
  useUpdateTagMutation,
} from '@/stores/managementStore/tagStore/tagStoreApi';

const TagForm = ({
  isEditing,
  toggle,
  id,
  data,
}: TModalFormProps<ITagObjResponse>) => {
  const { toast } = useToast();
  const {
    control,
    handleSubmit,
    setValue,
    formState: { isDirty, isValid },
  } = useForm<TTagRequestFormObject>({
    defaultValues: {
      tagDevice: data?.name,
      companyId: data?.company?.id,
    },
    resolver: yupResolver(tagValidationSchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });
  const userType = useUserType();
  const [createTag] = useCreateTagMutation();
  const [updateTag] = useUpdateTagMutation();
  useEffect(() => {
    if (userType && userType === 'systemadmin') {
      setValue('isSuperAdmin', true);
    }
  }, []);
  const sysadminPermission = userType === 'systemadmin';
  const { arr: companyOpt, isLoading: isLoadingCompanyOpts } = useCompanyOpts(
    removeEmptyObjects({ isPaginated: false }),
    { skip: !sysadminPermission },
  );
  const handleSubmitData: SubmitHandler<TTagRequestFormObject> = async (
    data,
    event,
  ) => {
    event?.preventDefault();
    const { tagDevice, companyId } = data;

    const handleTagApi = () => {
      const obj = {
        name: tagDevice,
        companyId: sysadminPermission ? companyId : null,
      };

      if (id) {
        return updateTag({
          id,
          data: {
            ...obj,
          },
        });
      } else {
        return createTag(obj);
      }
    };

    await handleTagApi()
      .unwrap()
      .then(() => {
        toast(
          generateDynamicToastMessage({
            title: 'Success',
            description: `Tag is ${id ? 'updated' : 'added'} successfully`,
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
      id="tagForm"
      onSubmit={handleSubmit(handleSubmitData)}
      className="grid grid-cols-1 gap-4"
    >
      <Controller
        name="tagDevice"
        control={control}
        render={({
          field: { onChange, value, onBlur },
          fieldState: { error },
        }) => {
          return (
            <InputComponent
              label="Tag Device"
              placeholder="Type Tag Device..."
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              required
              name="tagDevice"
              errorMessage={error?.message}
            />
          );
        }}
      />

      {sysadminPermission && (
        <Controller
          name="companyId"
          control={control}
          render={({ field: { onChange, value } }) => {
            return (
              <SelectComponent
                onChange={onChange}
                value={value}
                placeholder="Select Company"
                required={true}
                loading={isLoadingCompanyOpts}
                options={companyOpt}
                label="Company"
              />
            );
          }}
        />
      )}

      <DrawerSubmitAction
        submitText={isEditing ? 'Edit Tag' : 'Add Tag'}
        disabled={!isDirty || !isValid}
        toggle={toggle}
        form="tagForm"
      />
    </form>
  );
};

export default TagForm;
