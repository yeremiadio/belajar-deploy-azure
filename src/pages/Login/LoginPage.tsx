import AuthContainer from '@/components/AuthContainer';
import LoginForm from './_components/LoginForm';

export default function LoginPage() {
  return (
    <AuthContainer title="Sign In">
      <LoginForm />
    </AuthContainer>
  );
}
