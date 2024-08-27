import { FiEye } from 'react-icons/fi';
import { Controller, useForm } from 'react-hook-form';
import { FC, useState } from 'react';

import DrawerSubmitAction from '@/components/Form/DrawerSubmitAction';
import InputComponent from '@/components/InputComponent';
import { TUserPasswordForm } from '@/types/api/user';
import { yupResolver } from '@hookform/resolvers/yup';
import { userPasswordValidationSchema } from '@/utils/validations/user/userPasswordValidationSchema';
import { useUpdateUserPasswordMutation } from '@/stores/userStore/userStoreApi';
import { useToast } from '@/components/ui/use-toast';
import { ErrorMessageBackendDataShape } from '@/types/api';
import generateDynamicToastMessage from '@/utils/functions/generateDynamicToastMessage';

type Props = {
  toggle: () => void;
};

const PasswordForm: FC<Props> = ({ toggle }) => {
  const { toast } = useToast();

  const [showOldPwd, setShowOldPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  const [updatePassword, { isLoading }] = useUpdateUserPasswordMutation();

  const form = useForm<TUserPasswordForm>({
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    resolver: yupResolver(userPasswordValidationSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    await updatePassword({
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
    })
      .unwrap()
      .then(() => {
        toast(
          generateDynamicToastMessage({
            title: 'Success',
            description: `Password updated successfully`,
            variant: 'success',
          }),
        );
        toggle();
      })
      .catch((error: ErrorMessageBackendDataShape) => {
        toast(
          generateDynamicToastMessage({
            title: 'Failed',
            description: `Failed to update password "\n${error?.data?.message ?? ''}"`,
            variant: 'error',
          }),
        );
      });
  });

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Controller
        name="oldPassword"
        control={form.control}
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <InputComponent
            value={value}
            onChange={onChange}
            label="Old Password"
            endContent={
              <FiEye
                className="text-bp-hint hover:text-white"
                onClick={() => setShowOldPwd((prev) => !prev)}
              />
            }
            type={showOldPwd ? 'text' : 'password'}
            placeholder="Old Password"
            errorMessage={error?.message}
          />
        )}
      />
      <Controller
        name="newPassword"
        control={form.control}
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <InputComponent
            value={value}
            onChange={onChange}
            label="New Password"
            endContent={
              <FiEye
                className="text-bp-hint hover:text-white"
                onClick={() => setShowNewPwd((prev) => !prev)}
              />
            }
            type={showNewPwd ? 'text' : 'password'}
            placeholder="New Password"
            errorMessage={error?.message}
          />
        )}
      />
      <Controller
        name="confirmPassword"
        control={form.control}
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <InputComponent
            value={value}
            onChange={onChange}
            label="Re-type New Password"
            endContent={
              <FiEye
                className="text-bp-hint hover:text-white"
                onClick={() => setShowConfirmPwd((prev) => !prev)}
              />
            }
            type={showConfirmPwd ? 'text' : 'password'}
            placeholder="Re-type New Password"
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

export default PasswordForm;
