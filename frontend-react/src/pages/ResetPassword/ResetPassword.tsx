import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { AuthButton } from 'src/components/auth/AuthButton/AuthButton';
import { AuthForm } from 'src/components/auth/AuthForm/AuthForm';
import { AuthGoBackBtn } from 'src/components/auth/AuthGoBackBtn/AuthGoBackBtn';
import { AuthIcon } from 'src/components/auth/AuthIcon/AuthIcon';
import { AuthRedirectInfo } from 'src/components/auth/AuthRedirectInfo/AuthRedirectInfo';
import { Header } from 'src/components/Header/Header';
import {
  PasswordFields,
  PasswordFieldsFormData,
} from 'src/components/PasswordFields/PasswordFields';
import { useRouteParams } from 'src/hooks/useRouteParams';
import { useResetPassword } from 'src/queries/auth-queries';
import { Button } from 'src/ui-components';
import { AppRoutes, ResetPasswordParams } from 'src/utils/enums/app-routes';

export const ResetPassword = () => {
  const [params] = useRouteParams<ResetPasswordParams>();
  const form = useForm<PasswordFieldsFormData>();
  const { handleSubmit } = form;
  const { resetPassword, resetPasswordInProgress } = useResetPassword();
  const navigate = useNavigate();

  const onSubmit = (data: PasswordFieldsFormData) => {
    resetPassword(
      {
        tempId: params.tempId,
        newPassword: data.password,
      },
      {
        onSuccess: () => {
          navigate(AppRoutes.Login({ isFromResetPassword: 'true' }));
        },
      }
    );
  };

  return (
    <>
      <Header leftSlot={<AuthGoBackBtn />} />
      <AuthForm onSubmit={handleSubmit(onSubmit)}>
        <AuthIcon iconName='key'></AuthIcon>
        <PasswordFields form={form} labels={['Nowe hasło', 'Powtórz nowe hasło']} />
        <AuthButton disabled={resetPasswordInProgress}>Gotowe</AuthButton>
        <AuthRedirectInfo>
          <Button variant='text' component={Link} to={AppRoutes.Login()}>
            Wróć do logowania
          </Button>
        </AuthRedirectInfo>
      </AuthForm>
    </>
  );
};

ResetPassword.displayName = 'ResetPassword';
