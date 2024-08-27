import { Controller, useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { FiEye } from 'react-icons/fi';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useSearchParams } from 'react-router-dom';

import InputComponent from '@/components/InputComponent';
import { Button } from '@/components/ui/button';
import AuthContainer from '@/components/AuthContainer';
import { useToast } from '@/components/ui/use-toast';

import { TUserResetPasswordConfirmForm } from '@/types/api/user';
import { ErrorMessageBackendDataShape } from '@/types/api';

import { userResetPasswordValidationSchema } from '@/utils/validations/user/userResetPasswordValidationSchema';
import { usePostResetPasswordMutation } from '@/stores/userStore/userStoreApi';

import generateDynamicToastMessage from '@/utils/functions/generateDynamicToastMessage';
import { ROUTES } from '@/utils/configs/route';

const ResetPasswordConfirm = () => {
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const navigate = useNavigate();

  const oneTimeToken = searchParams.get('token');

  useEffect(() => {
    if (!oneTimeToken) {
      toast(
        generateDynamicToastMessage({
          title: 'Failed',
          description: `Invalid token`,
          variant: 'error',
        }),
      );
      navigate(ROUTES.login);
    }
  }, [oneTimeToken]);

  const [resetPassword, { isLoading }] = usePostResetPasswordMutation();

  const form = useForm<TUserResetPasswordConfirmForm>({
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
    resolver: yupResolver(userResetPasswordValidationSchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    if (!oneTimeToken) return;

    await resetPassword({
      password: data.newPassword,
      jwt: oneTimeToken,
    })
      .unwrap()
      .then(() => {
        toast(
          generateDynamicToastMessage({
            title: 'Success',
            description: `Password reset successfully`,
            variant: 'success',
          }),
        );
        navigate(ROUTES.login);
      })
      .catch((error: ErrorMessageBackendDataShape) => {
        toast(
          generateDynamicToastMessage({
            title: 'Failed',
            description: `Failed to reset password "\n${error?.data?.message ?? ''}"`,
            variant: 'error',
          }),
        );
      });
  });

  return (
    <AuthContainer title="Change Password">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Controller
          name="newPassword"
          control={form.control}
          render={({
            field: { onChange, value, onBlur },
            fieldState: { error },
          }) => (
            <InputComponent
              label="New Password"
              placeholder="New Password"
              type={showPwd ? 'text' : 'password'}
              onChange={onChange}
              onBlur={onBlur}
              containerStyle="grid w-full items-center gap-2.5"
              labelStyle="text-lg text-white"
              inputStyle="h-[50px] rounded-[10px] border-rs-v2-thunder-blue bg-rs-v2-thunder-blue text-white focus-visible:bg-rs-v2-thunder-blue focus-visible:ring-0 focus-visible:ring-offset-0"
              value={value}
              errorMessage={error?.message}
              endContent={
                <FiEye
                  className="text-bp-hint hover:text-white"
                  onClick={() => setShowPwd((prev) => !prev)}
                />
              }
            />
          )}
        />
        <Controller
          name="confirmPassword"
          control={form.control}
          render={({
            field: { onChange, value, onBlur },
            fieldState: { error },
          }) => (
            <InputComponent
              label="Re-type Password"
              placeholder="Re-type Password"
              type={showConfirmPwd ? 'text' : 'password'}
              onChange={onChange}
              onBlur={onBlur}
              containerStyle="grid w-full items-center gap-2.5"
              labelStyle="text-lg text-white"
              inputStyle="h-[50px] rounded-[10px] border-rs-v2-thunder-blue bg-rs-v2-thunder-blue text-white focus-visible:bg-rs-v2-thunder-blue focus-visible:ring-0 focus-visible:ring-offset-0"
              value={value}
              errorMessage={error?.message}
              endContent={
                <FiEye
                  className="text-bp-hint hover:text-white"
                  onClick={() => setShowConfirmPwd((prev) => !prev)}
                />
              }
            />
          )}
        />
        <div className="mt-7 min-h-[84px] w-full">
          <Button
            disabled={isLoading}
            type="submit"
            className="w-full rounded-lg bg-rs-v2-midnight-blue py-[27px] text-xl font-semibold text-white hover:bg-rs-v2-midnight-blue/80"
          >
            {isLoading ? 'Loading...' : 'Update'}
          </Button>
        </div>
      </form>
    </AuthContainer>
  );
};

export default ResetPasswordConfirm;
