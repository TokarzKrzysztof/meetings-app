import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { AuthButton } from 'src/components/auth/AuthButton/AuthButton';
import { AuthForm } from 'src/components/auth/AuthForm/AuthForm';
import { AuthGoBackBtn } from 'src/components/auth/AuthGoBackBtn/AuthGoBackBtn';
import { AuthIcon } from 'src/components/auth/AuthIcon/AuthIcon';
import { AuthRedirectInfo } from 'src/components/auth/AuthRedirectInfo/AuthRedirectInfo';
import { FormField } from 'src/components/FormField/FormField';
import { Header } from 'src/components/Header/Header';
import { useSetQueryData } from 'src/hooks/useSetQueryData';
import { LoginCredentials } from 'src/models/login-credentials';
import { useLogin, useResendActivationLink } from 'src/queries/auth-queries';
import { Button, Typography } from 'src/ui-components';
import { AppRoutes } from 'src/utils/enums/app-routes';
import { ValidationMessages } from 'src/utils/helpers/validation-messages';
import { ValidationPatterns } from 'src/utils/helpers/validation-patterns';

export const Login = () => {
  const form = useForm<LoginCredentials>();
  const { register, handleSubmit, getValues } = form;
  const navigate = useNavigate();
  const { setCurrentUser } = useSetQueryData();
  const { login, loginError, loginInProgress, loginReset } = useLogin();
  const { resendActivationLink } = useResendActivationLink();
  const { enqueueSnackbar } = useSnackbar();

  const onSubmit = (data: LoginCredentials) => {
    login(data, {
      onSuccess: (user) => {
        setCurrentUser(user);
        navigate(AppRoutes.Home);
      },
      onError: (err) => {
        if (err.response?.data.statusCode === 403) {
          resendActivationLink(getValues('email'));
        }
      },
    });
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('isFromActivation')) {
      enqueueSnackbar({
        variant: 'success',
        message:
          'Twoje konto zostało pomyślnie aktywowane, możesz się teraz zalogować',
      });
    }
    if (params.get('isFromResetPassword')) {
      enqueueSnackbar({
        variant: 'success',
        message: 'Twoje hasło zostało zmienione',
      });
    }
  }, []);

  return (
    <>
      <Header leftSlot={<AuthGoBackBtn />} />
      <AuthForm
        onSubmit={handleSubmit(onSubmit)}
        onChange={() => loginError && loginReset()}
      >
        <AuthIcon iconName='account_circle'></AuthIcon>
        <FormField
          form={form}
          label={'Email'}
          {...register('email', {
            required: ValidationMessages.required,
            pattern: {
              value: ValidationPatterns.email,
              message: ValidationMessages.email,
            },
          })}
        ></FormField>
        <FormField
          form={form}
          label={'Hasło'}
          {...register('password', { required: ValidationMessages.required })}
          type='password'
          InputProps={{
            endAdornment: (
              <Button
                variant='text'
                component={Link}
                sx={{ whiteSpace: 'nowrap', minWidth: 'auto', fontSize: 11 }}
                to={AppRoutes.ForgotPassword}
              >
                Zapomniałem hasła
              </Button>
            ),
          }}
        ></FormField>
        {loginError?.statusCode === 401 && (
          <Typography color={'error'}>
            Email i/lub hasło są nieprawidłowe
          </Typography>
        )}
        {loginError?.statusCode === 403 && (
          <Typography color={'error'}>
            Twoje konto nie zostało jeszcze aktywowane. Na adres email podany
            przy rejestracji wysłaliśmy ponownie instrukcję dotyczącą aktywacji
            konta.
          </Typography>
        )}
        <AuthButton disabled={loginInProgress}>Zaloguj</AuthButton>
        <AuthRedirectInfo>
          Nie masz jeszcze konta?{' '}
          <Button variant='text' component={Link} to={AppRoutes.Register}>
            Zarejestruj się
          </Button>
        </AuthRedirectInfo>
      </AuthForm>
    </>
  );
};

Login.displayName = 'Login';
