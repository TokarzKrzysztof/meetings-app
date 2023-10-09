import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { AuthButton } from 'src/components/AuthButton/AuthButton';
import { AuthForm } from 'src/components/AuthForm/AuthForm';
import { AuthGoBackBtn } from 'src/components/AuthGoBackBtn/AuthGoBackBtn';
import { AuthIcon } from 'src/components/AuthIcon/AuthIcon';
import { AuthRedirectInfo } from 'src/components/AuthRedirectInfo/AuthRedirectInfo';
import { ControlledFormField } from 'src/components/ControlledFormField/ControlledFormField';
import { FormField } from 'src/components/FormField/FormField';
import { Header } from 'src/components/Header/Header';
import { LoginCredentials } from 'src/models/login-credentials';
import {
  useAuthLogin,
  useAuthResendActivationLink,
} from 'src/queries/auth-queries';
import { Box, Button, Typography } from 'src/ui-components';
import { AppRoutes } from 'src/utils/enums/app-routes';
import { LocalStorage } from 'src/utils/helpers/local-storage';
import { ValidationMessages } from 'src/utils/helpers/validation-messages';
import { ValidationPatterns } from 'src/utils/helpers/validation-patterns';

export async function loader() {
  return null;
}

const setDefaultValues = () => {
  const storedCredentials = LocalStorage.getObjectValue('login-credentials');
  if (storedCredentials) {
    return { ...storedCredentials, rememberCredentials: true };
  }
  return {};
};

type FormData = LoginCredentials & { rememberCredentials: boolean };

export const Login = () => {
  const form = useForm<FormData>({
    defaultValues: setDefaultValues(),
  });
  const { register, handleSubmit, control, reset, getValues } = form;
  const navigate = useNavigate();
  const { login, loginError, loginInProgress, loginReset } = useAuthLogin();
  const { resendActivationLink } = useAuthResendActivationLink();
  const { enqueueSnackbar } = useSnackbar();

  const onSubmit = (data: FormData) => {
    login(data, {
      onSuccess: (result) => {
        LocalStorage.setValue('token', result);
        const { email, password, rememberCredentials } = getValues();
        if (rememberCredentials) {
          LocalStorage.setObjectValue('login-credentials', { email, password });
        } else {
          LocalStorage.clearValue('login-credentials');
        }
  
        navigate(AppRoutes.Home);
      },
      onError: (err) => {
        if (err.response?.data.statusCode === 403) {
          resendActivationLink(getValues('email'));
        }
      },
    })
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
        ></FormField>
        <Box
          display={'flex'}
          justifyContent={'space-between'}
          flexWrap={'wrap'}
          alignItems={'center'}
        >
          <ControlledFormField
            element='checkbox'
            label={'Zapamiętaj mnie'}
            control={control}
            name={'rememberCredentials'}
          ></ControlledFormField>
          <Button variant='text' component={Link} to={AppRoutes.RemindPassword}>
            Zapomniałem hasła
          </Button>
        </Box>
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
