import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import DrawerSubmitAction from '@/components/Form/DrawerSubmitAction';
import InputComponent from '@/components/InputComponent';
import SelectComponent from '@/components/Select';
import Spinner from '@/components/Spinner';
import { toast } from '@/components/ui/use-toast';

import {
  useCreateCompanyMutation,
  useUpdateCompanyMutation,
} from '@/stores/managementStore/companyStore/companyStoreApi';

import { ErrorMessageBackendDataShape } from '@/types/api';
import {
  ICompany,
  ICompanyObj,
  TCompanyRequestFormObject,
} from '@/types/api/management/company';
import { TModalFormProps } from '@/types/modal';

import generateDynamicToastMessage from '@/utils/functions/generateDynamicToastMessage';
import generateStatusCodesMessage from '@/utils/functions/generateStatusCodesMessage';
import isFieldRequired from '@/utils/functions/isFieldRequired';
import useModuleOpts from '@/utils/hooks/selectOptions/useModuleOptions';
import companyValidationSchema from '@/utils/validations/management/company/companyValidationSchema';

const CompanyForm = ({
  data,
  toggle,
  isEditing,
}: TModalFormProps<ICompany>) => {
  const {
    control,
    handleSubmit,

    formState: { isDirty, isValid },
  } = useForm<TCompanyRequestFormObject>({
    defaultValues: {
      name: data?.name ?? '',
      description: data?.description ?? '',
      module: data?.modules.map((value) => value.id),
    },
    resolver: yupResolver(companyValidationSchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });
  const [createCompany, { isLoading: isCreatingCompany }] =
    useCreateCompanyMutation();

  const [updateCompany, { isLoading: isEditingCompany }] =
    useUpdateCompanyMutation();

  const isRequired = (fieldName: keyof TCompanyRequestFormObject): boolean => {
    const value = isFieldRequired<TCompanyRequestFormObject>(
      companyValidationSchema,
      fieldName,
    );
    return value;
  };
  const { arr: moduleOptions } = useModuleOpts({});

  const handleSubmitItem: SubmitHandler<TCompanyRequestFormObject> = async (
    formData,
    event,
  ) => {
    event?.preventDefault();
    const baseFormData = {
      name: formData?.name ?? '',
      description: formData?.description ?? '',
      moduleIds: formData?.module ? formData?.module.map((value) => value) : [],
    };
    if (isEditing) {
      if (!data?.id || !formData) return;
      const formDataUpdate: Partial<ICompanyObj> = { ...baseFormData };
      await updateCompany({ id: data?.id, data: formDataUpdate })
        .unwrap()
        .then(() => {
          toggle();
          toast(
            generateDynamicToastMessage({
              title: 'Success',
              description: 'Company updated successfully',
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
      const formDataCreate: Partial<ICompanyObj> = {
        ...baseFormData,
      };
      await createCompany({ ...formDataCreate })
        .unwrap()
        .then(() => {
          toggle();
          toast(
            generateDynamicToastMessage({
              title: 'Success',
              description: 'Company created successfully',
              variant: 'success',
            }),
          );
        })
        .catch((error: ErrorMessageBackendDataShape) => {
          toast(
            generateDynamicToastMessage({
              title: 'Failed',
              description: `Failed creating user ${error?.data?.message ?? ''}`,
              variant: 'error',
            }),
          );
        });
    }
  };

  return (
    <form id="companyForm" onSubmit={handleSubmit(handleSubmitItem)}>
      <Controller
        name="name"
        control={control}
        render={({
          field: { onChange, value, onBlur },
          fieldState: { error },
        }) => {
          return (
            <InputComponent
              label="Company"
              placeholder="Company"
              onChange={onChange}
              onBlur={onBlur}
              required={isRequired('name')}
              value={value}
              errorMessage={error?.message}
            />
          );
        }}
      />
      <Controller
        name="description"
        control={control}
        render={({
          field: { onChange, value, onBlur },
          fieldState: { error },
        }) => {
          return (
            <InputComponent
              label="Description"
              placeholder="Description"
              onChange={onChange}
              onBlur={onBlur}
              containerStyle="mb-3 gap-2 grid w-full"
              value={value}
              errorMessage={error?.message}
            />
          );
        }}
      />
      <Controller
        name="module"
        control={control}
        render={({
          field: { onChange, value, onBlur },
          fieldState: { error },
        }) => {
          return (
            <SelectComponent
              mode="multiple"
              onChange={onChange}
              value={value}
              label="Module"
              required={isRequired('module')}
              placeholder="Module..."
              onBlur={onBlur}
              errorMessage={error?.message}
              className="mb-3"
              isError={!!error?.message}
              options={moduleOptions}
            />
          );
        }}
      />
      <DrawerSubmitAction
        submitText={
          isCreatingCompany || isEditingCompany ? (
            <Spinner size={18} borderWidth={1.5} isFullWidthAndHeight />
          ) : isEditing ? (
            'Save Changes'
          ) : (
            'Add Company'
          )
        }
        disabled={(!isEditing && !isDirty) || !isValid}
        toggle={toggle}
        form="companyForm"
      />
    </form>
  );
};

export default CompanyForm;
