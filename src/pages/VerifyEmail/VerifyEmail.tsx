import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import Spinner from '@/components/Spinner';
import { useToast } from '@/components/ui/use-toast';

import { ROUTES } from '@/utils/configs/route';
import generateDynamicToastMessage from '@/utils/functions/generateDynamicToastMessage';

import { usePostVerifyEmailMutation } from '@/stores/userStore/userStoreApi';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const [verifyEmail] = usePostVerifyEmailMutation();

  const jwt = searchParams.get('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (!jwt) {
      navigate(ROUTES.base);
    } else {
      verifyEmail({ jwt })
        .unwrap()
        .then(() => {
          toast(
            generateDynamicToastMessage({
              title: 'Success',
              description: `Email is verified successfully`,
              variant: 'success',
            }),
          );
        })
        .catch(() => {
          toast(
            generateDynamicToastMessage({
              title: 'Failed',
              description: `Failed to verify email`,
              variant: 'error',
            }),
          );
        })
        .finally(() => {
          navigate(ROUTES.base);
        });
    }
  }, [jwt]);

  return (
    <div className="flex h-screen w-full flex-col justify-center gap-3 border">
      <Spinner isFullWidthAndHeight={false} />
      <p className="text-center">Verifying...</p>
    </div>
  );
};

export default VerifyEmail;
