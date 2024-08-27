import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import DrawerSubmitAction from '@/components/Form/DrawerSubmitAction';
import InputComponent from '@/components/InputComponent';
import SelectComponent from '@/components/Select';
import Spinner from '@/components/Spinner';
import { toast } from '@/components/ui/use-toast';

import { loadCookie } from '@/services/cookie';

import {
  useCreateUserMutation,
  useUpdateUserMutation,
} from '@/stores/managementStore/userStore';

import { ErrorMessageBackendDataShape } from '@/types/api';
import {
  IUserData,
  IUserRequestObj,
  TUserRequestFormObject,
} from '@/types/api/user';
import { TModalFormProps } from '@/types/modal';

import generateDynamicToastMessage from '@/utils/functions/generateDynamicToastMessage';
import isFieldRequired from '@/utils/functions/isFieldRequired';
import useUserType from '@/utils/hooks/auth/useUserType';
import useCompanyOpts from '@/utils/hooks/selectOptions/useCompanyOptions';
import useUsertypeOptions from '@/utils/hooks/selectOptions/useUsertypeOptions';
import userValidationSchema from '@/utils/validations/management/user/userValidationSchema';
import generateStatusCodesMessage from '@/utils/functions/generateStatusCodesMessage';

const UserForm = ({ data, toggle, isEditing }: TModalFormProps<IUserData>) => {
  const currentUserType = useUserType();
  const {
    control,
    handleSubmit,
    formState: { isDirty, isValid },
  } = useForm<TUserRequestFormObject>({
    defaultValues: {
      firstname: data?.firstname ?? '',
      lastname: data?.lastname ?? '',
      email: data?.email ?? '',
      username: data?.username ?? '',
      usertypeId: data?.usertypeId ?? undefined,
      companyId: data?.companyId ?? null,
      phonenumber: data?.phonenumber ?? '',
    },
    resolver: yupResolver(userValidationSchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

  const [createAccount, { isLoading: isCreatingAccount }] =
    useCreateUserMutation();

  const [updateAccount, { isLoading: isEditingAccount }] =
    useUpdateUserMutation();

  const isRequired = (fieldName: keyof TUserRequestFormObject): boolean => {
    const value = isFieldRequired<TUserRequestFormObject>(
      userValidationSchema,
      fieldName,
    );
    return value;
  };

  const { arr: usertypeOptions } = useUsertypeOptions({ excludeRoles: true });
  const { arr: companyOptions, isLoading: isLoadingCompanyOptions } =
    useCompanyOpts(
      { isPaginated: false },
      { skip: currentUserType !== 'systemadmin' },
    );

  const handleSubmitItem: SubmitHandler<TUserRequestFormObject> = async (
    formData,
    event,
  ) => {
    event?.preventDefault();
    const baseFormData = {
      firstname: formData?.firstname ?? '',
      lastname: formData?.lastname ?? '',
      email: formData?.email ?? '',
      username: formData?.username ?? '',
      usertypeId: formData?.usertypeId ?? undefined,
      phonenumber: formData?.phonenumber ?? '',
      companyId: formData?.companyId ?? Number(loadCookie('companyId')),
      password: 'Asdf1234.',
    };
    if (isEditing) {
      if (!data?.id || !formData) return;
      const formDataUpdate: Partial<IUserRequestObj> = { ...baseFormData };
      await updateAccount({ id: data?.id, data: formDataUpdate })
        .unwrap()
        .then(() => {
          toggle();
          toast(
            generateDynamicToastMessage({
              title: 'Success',
              description: 'Account updated successfully',
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
      const formDataCreate: Partial<IUserRequestObj> = {
        ...baseFormData,
      };
      await createAccount({ ...formDataCreate })
        .unwrap()
        .then(() => {
          toggle();
          toast(
            generateDynamicToastMessage({
              title: 'Success',
              description: 'Account created successfully',
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
    <form id="userForm" onSubmit={handleSubmit(handleSubmitItem)}>
      <div className="my-3 grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <Controller
            name="firstname"
            control={control}
            render={({
              field: { onChange, value, onBlur },
              fieldState: { error },
            }) => {
              return (
                <InputComponent
                  label="Firstname"
                  placeholder="Firstname"
                  onChange={onChange}
                  onBlur={onBlur}
                  required={isRequired('firstname')}
                  value={value}
                  errorMessage={error?.message}
                />
              );
            }}
          />{' '}
        </div>
        <div className="flex flex-col">
          <Controller
            name="lastname"
            control={control}
            render={({
              field: { onChange, value, onBlur },
              fieldState: { error },
            }) => {
              return (
                <InputComponent
                  label="Lastname"
                  placeholder="Lastname"
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                  errorMessage={error?.message}
                />
              );
            }}
          />
        </div>
      </div>
      <Controller
        name="usertypeId"
        control={control}
        render={({
          field: { onChange, value, onBlur },
          fieldState: { error },
        }) => {
          return (
            <SelectComponent
              onChange={onChange}
              value={value}
              label="Role"
              required={isRequired('usertypeId')}
              placeholder="Role..."
              onBlur={onBlur}
              errorMessage={error?.message}
              className="mb-3"
              isError={!!error?.message}
              options={usertypeOptions}
            />
          );
        }}
      />
      {currentUserType === 'systemadmin' && (
        <Controller
          name="companyId"
          control={control}
          render={({
            field: { onChange, value, onBlur },
            fieldState: { error },
          }) => {
            return (
              <SelectComponent
                onChange={onChange}
                value={value}
                label="Company"
                required={isRequired('companyId')}
                placeholder="Company..."
                onBlur={onBlur}
                errorMessage={error?.message}
                isError={!!error?.message}
                className="mb-3"
                loading={isLoadingCompanyOptions}
                options={companyOptions}
              />
            );
          }}
        />
      )}
      <Controller
        name="username"
        control={control}
        render={({
          field: { onChange, value, onBlur },
          fieldState: { error },
        }) => {
          return (
            <InputComponent
              label="Username"
              placeholder="Username"
              onChange={onChange}
              onBlur={onBlur}
              containerStyle="mb-3 gap-2 grid w-full"
              required={isRequired('username')}
              value={value}
              errorMessage={error?.message}
            />
          );
        }}
      />
      <Controller
        name="email"
        control={control}
        render={({
          field: { onChange, value, onBlur },
          fieldState: { error },
        }) => {
          return (
            <InputComponent
              label="Email"
              placeholder="Email"
              onChange={onChange}
              onBlur={onBlur}
              containerStyle="mb-3 gap-2 grid w-full"
              required={isRequired('email')}
              value={value}
              errorMessage={error?.message}
            />
          );
        }}
      />
      <Controller
        name="phonenumber"
        control={control}
        render={({
          field: { onChange, value, onBlur },
          fieldState: { error },
        }) => {
          return (
            <InputComponent
              label="Whatsapp Number"
              placeholder="Whatsapp Number"
              onChange={onChange}
              onBlur={onBlur}
              containerStyle="mb-3 gap-2 grid w-full"
              required={isRequired('phonenumber')}
              value={value}
              errorMessage={error?.message}
            />
          );
        }}
      />
      <DrawerSubmitAction
        submitText={
          isCreatingAccount || isEditingAccount ? (
            <Spinner size={18} borderWidth={1.5} isFullWidthAndHeight />
          ) : isEditing ? (
            'Save Changes'
          ) : (
            'Add Account'
          )
        }
        disabled={!isDirty || !isValid}
        toggle={toggle}
        form="userForm"
      />
    </form>
  );
};

export default UserForm;
