import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from 'src/components/header/Header';
import { useRouteParams } from 'src/hooks/useRouteParams';
import { AuthButton } from 'src/pages/account/shared/AuthButton';
import { AuthForm } from 'src/pages/account/shared/AuthForm';
import { AuthGoBackBtn } from 'src/pages/account/shared/AuthGoBackBtn';
import { AuthIcon } from 'src/pages/account/shared/AuthIcon';
import { AuthRedirectInfo } from 'src/pages/account/shared/AuthRedirectInfo';
import {
  PasswordFields,
  PasswordFieldsFormData,
} from 'src/pages/account/shared/PasswordFields';
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
