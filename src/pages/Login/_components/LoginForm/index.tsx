import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { FiEye } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';

import InputComponent from '@/components/InputComponent';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { loadCookie } from '@/services/cookie';
import { LoginFormData } from '@/types/api/auth';
import { getDefaultRouteByUserTypeName } from '@/utils/functions/auth';
import generateDynamicToastMessage from '@/utils/functions/generateDynamicToastMessage';
import useLogin from '@/utils/hooks/useLogin';
import { loginSchema } from '@/utils/validations/LoginValidation';
import { yupResolver } from '@hookform/resolvers/yup';
import { ROUTES } from '@/utils/configs/route';

export default function LoginForm() {
  const navigate = useNavigate();
  const [showPwd, setShowPwd] = useState(false);
  const { login, loading } = useLogin();

  const { toast } = useToast();

  const loginForm = useForm<LoginFormData>({
    defaultValues: {
      username: '',
      password: '',
    },
    resolver: yupResolver(loginSchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

  const handleSubmit = async (data: LoginFormData) => {
    const response = await login(data);
    if (response?.status === 'success') {
      toast(
        generateDynamicToastMessage({
          title: 'Success',
          description:
            response?.message ??
            `Welcome to Rapidsense, ${response?.data.username ?? ''}.`,
          variant: 'success',
        }),
      );
      // Redirect to default route by usertypeName after login
      const usertypeName = loadCookie('usertypeName');
      const route = getDefaultRouteByUserTypeName(usertypeName ?? '');
      navigate(route);
    } else {
      toast(
        generateDynamicToastMessage({
          title: 'Failed',
          description: 'There was an error, please try again.',
          variant: 'error',
        }),
      );
    }
  };

  return (
    <form onSubmit={loginForm.handleSubmit(handleSubmit)}>
      <div className="flex flex-col gap-5">
        <Controller
          name="username"
          control={loginForm.control}
          render={({
            field: { onChange, value, onBlur },
            fieldState: { error },
          }) => (
            <InputComponent
              label="Username"
              placeholder="Enter your username..."
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
        <Controller
          name="password"
          control={loginForm.control}
          render={({
            field: { onChange, value, onBlur },
            fieldState: { error },
          }) => (
            <InputComponent
              label="Password"
              placeholder="Enter your Password..."
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
        <Link to={ROUTES.resetPassword} className="text-sm text-white">
          Forgot Password?
        </Link>
        <div className="mt-7 min-h-[84px] w-full">
          <Button
            disabled={loading}
            type="submit"
            className="w-full rounded-lg bg-rs-v2-midnight-blue py-[27px] text-xl font-semibold text-white hover:bg-rs-v2-midnight-blue/80"
          >
            {loading ? 'Loading...' : 'Sign In'}
          </Button>
        </div>
      </div>
    </form>
  );
}
