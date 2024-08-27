import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import InputComponent from '@/components/InputComponent';
import { Button } from '@/components/ui/button';
import AuthContainer from '@/components/AuthContainer';
import { useToast } from '@/components/ui/use-toast';

import { usePostForgotPasswordMutation } from '@/stores/userStore/userStoreApi';

import { userForgotPasswordValidationSchema } from '@/utils/validations/user/userForgotPasswordValidationSchema';
import useCountdown from '@/utils/hooks/useCountdown';
import generateDynamicToastMessage from '@/utils/functions/generateDynamicToastMessage';

import { ErrorMessageBackendDataShape } from '@/types/api';

const ResetPassword = () => {
  const { toast } = useToast();
  const [disableTimestamp, setDisableTimestamp] = useState<Date>();

  const disabledCountdown = useCountdown(disableTimestamp);
  const disableForgotPassword =
    !!disabledCountdown && disabledCountdown !== '00:00:00';

  const form = useForm<{ username: string }>({
    defaultValues: {
      username: '',
    },
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    resolver: yupResolver(userForgotPasswordValidationSchema),
  });

  const [resetPassword, { isLoading }] = usePostForgotPasswordMutation();

  const handleSubmit = form.handleSubmit(async (data) => {
    if (disableForgotPassword) return;

    resetPassword({
      username: data.username,
    })
      .unwrap()
      .then(() => {
        storeLastRequestOnLocalStorage();
        toast(
          generateDynamicToastMessage({
            title: 'Success',
            description: `Forgot password email sent successfully`,
            variant: 'success',
          }),
        );
      })
      .catch((error: ErrorMessageBackendDataShape) => {
        toast(
          generateDynamicToastMessage({
            title: 'Failed',
            description: `Failed to send forgot password email "\n${error?.data?.message ?? ''}"`,
            variant: 'error',
          }),
        );
      });
  });

  const storeLastRequestOnLocalStorage = () => {
    const lastRequest = JSON.parse(
      localStorage.getItem('forgotPasswordRequest') || '{}',
    );

    const currentAttemp = lastRequest?.attempt
      ? lastRequest.attempt > 3
        ? 0
        : lastRequest.attempt + 1
      : 1;

    const disabled =
      lastRequest?.attempt > 3
        ? new Date().getTime() + 60000 * 60 * 24
        : lastRequest?.attempt === 3
          ? new Date().getTime() + 60000 * 30
          : new Date().getTime() + 60000;

    localStorage.setItem(
      'forgotPasswordRequest',
      JSON.stringify({
        attempt: currentAttemp,
        disabled: disabled,
        expired: new Date().getTime() + 60000 * 60 * 24,
      }),
    );

    setDisableTimestamp(new Date(disabled));
  };

  useEffect(() => {
    const lastRequest = JSON.parse(
      localStorage.getItem('forgotPasswordRequest') || '{}',
    );

    const currentTimestamp = new Date().getTime();

    if (lastRequest?.expired < currentTimestamp) {
      localStorage.removeItem('forgotPasswordRequest');
      return;
    }

    if (lastRequest.disabled && lastRequest.disabled > currentTimestamp) {
      setDisableTimestamp(new Date(lastRequest.disabled));
    }
  }, []);

  return (
    <AuthContainer title="Forgot Password">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Controller
          name="username"
          control={form.control}
          render={({
            field: { onChange, value, onBlur },
            fieldState: { error },
          }) => (
            <InputComponent
              label="Username"
              placeholder="Input your Username"
              onChange={onChange}
              onBlur={onBlur}
              containerStyle="grid w-full items-center gap-2.5"
              labelStyle="text-lg text-white"
              inputStyle="h-[50px] rounded-[10px] border-rs-v2-thunder-blue bg-rs-v2-thunder-blue text-white focus-visible:bg-rs-v2-thunder-blue focus-visible:ring-0 focus-visible:ring-offset-0"
              value={value}
              errorMessage={error?.message}
            />
          )}
        />
        <div className="mt-7 min-h-[84px] w-full">
          <Button
            disabled={isLoading || disableForgotPassword}
            type="submit"
            className="w-full rounded-lg bg-rs-v2-midnight-blue py-[27px] text-xl font-semibold text-white hover:bg-rs-v2-midnight-blue/80"
          >
            {isLoading ? 'Loading...' : 'Submit'}
          </Button>
          {disableForgotPassword && (
            <p className="mt-5 text-sm text-rs-neutral-gray-gull">
              Your new request will be available in {disabledCountdown}
            </p>
          )}
        </div>
      </form>
    </AuthContainer>
  );
};

export default ResetPassword;
