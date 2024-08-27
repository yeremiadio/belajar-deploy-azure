import { FC } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import DrawerSubmitAction from '@/components/Form/DrawerSubmitAction';
import InputComponent from '@/components/InputComponent';
import { useToast } from '@/components/ui/use-toast';

import { TUserProfileForm, TUserProfileResponse } from '@/types/api/user';
import { ErrorMessageBackendDataShape } from '@/types/api';

import { useUpdateUserProfileMutation } from '@/stores/userStore/userStoreApi';

import generateDynamicToastMessage from '@/utils/functions/generateDynamicToastMessage';
import userProfileValidationSchema from '@/utils/validations/user/userProfileValidationSchema';

type Props = {
  toggle: () => void;
  data?: TUserProfileResponse;
};

const AccountForm: FC<Props> = ({ toggle, data }) => {
  const { toast } = useToast();

  const [updateUserProfile, { isLoading }] = useUpdateUserProfileMutation();

  const form = useForm<TUserProfileForm>({
    defaultValues: {
      email: data?.email ?? '',
      username: data?.username ?? '',
      firstname: data?.firstname ?? '',
      lastname: data?.lastname ?? '',
      phonenumber: data?.phonenumber ?? '',
    },
    resolver: yupResolver(userProfileValidationSchema),
    reValidateMode: 'onBlur',
    mode: 'onBlur',
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    await updateUserProfile(data)
      .unwrap()
      .then(() => {
        toast(
          generateDynamicToastMessage({
            title: 'Success',
            description: `Profile updated successfully`,
            variant: 'success',
          }),
        );
        toggle();
      })
      .catch((error: ErrorMessageBackendDataShape) => {
        toast(
          generateDynamicToastMessage({
            title: 'Failed',
            description: `Failed to update profile "\n${error?.data?.message ?? ''}"`,
            variant: 'error',
          }),
        );
      });
  });

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Controller
        name="username"
        control={form.control}
        render={({
          field: { value, onChange, onBlur },
          fieldState: { error },
        }) => (
          <InputComponent
            value={value}
            onChange={onChange}
            label="Username"
            placeholder="Username"
            onBlur={onBlur}
            errorMessage={error?.message}
          />
        )}
      />

      <div className="flex items-start gap-2">
        <Controller
          name="firstname"
          control={form.control}
          render={({
            field: { value, onChange, onBlur },
            fieldState: { error },
          }) => (
            <InputComponent
              value={value}
              label="Display Name"
              onChange={onChange}
              placeholder="First Name"
              onBlur={onBlur}
              errorMessage={error?.message}
            />
          )}
        />
        <Controller
          name="lastname"
          control={form.control}
          render={({
            field: { value, onChange, onBlur },
            fieldState: { error },
          }) => (
            <InputComponent
              value={value}
              onChange={onChange}
              label="‎"
              placeholder="Last Name"
              onBlur={onBlur}
              errorMessage={error?.message}
            />
          )}
        />
      </div>

      <Controller
        name="email"
        control={form.control}
        render={({
          field: { value, onChange, onBlur },
          fieldState: { error },
        }) => (
          <InputComponent
            value={value}
            onChange={onChange}
            label="Email"
            placeholder="Email"
            onBlur={onBlur}
            errorMessage={error?.message}
          />
        )}
      />

      <Controller
        name="phonenumber"
        control={form.control}
        render={({
          field: { value, onChange, onBlur },
          fieldState: { error },
        }) => (
          <InputComponent
            value={value}
            onChange={onChange}
            type="number"
            label="Whatsapp No."
            placeholder="Whatsapp No."
            onBlur={onBlur}
            errorMessage={error?.message}
          />
        )}
      />
      <DrawerSubmitAction
        disabled={isLoading}
        submitText={isLoading ? 'Saving...' : 'Save Changes'}
        toggle={toggle}
      />
    </form>
  );
};

export default AccountForm;
