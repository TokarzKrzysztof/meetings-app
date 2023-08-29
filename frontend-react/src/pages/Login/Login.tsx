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
import { useLogin } from 'src/queries/auth-queries';
import { Box, Button, Typography } from 'src/ui-components';
import { AppRoutes } from 'src/utils/enums/app-routes';
import { LocalStorage } from 'src/utils/helpers/local-storage';
import { ValidationMessages } from 'src/utils/helpers/validation-messages';
import { ValidationPatterns } from 'src/utils/helpers/validation-patterns';

export async function loader() {
  return null;
}

type FormData = LoginCredentials & { rememberCredentials: boolean };

export const Login = () => {
  const form = useForm<FormData>();
  const { register, handleSubmit, control, reset, getValues } = form;
  const navigate = useNavigate();
  const { login, loginError, loginInProgress, loginReset } = useLogin({
    onSuccess: (result) => {
      LocalStorage.setValue('token', result);
      const { email, password, rememberCredentials } = getValues();
      if (rememberCredentials) {
        LocalStorage.setObjectValue('login-credentials', { email, password });
      }
      navigate(AppRoutes.Home);
    },
  });

  useEffect(() => {
    const storedCredentials = LocalStorage.getObjectValue('login-credentials');
    if (storedCredentials) {
      reset({ ...storedCredentials, rememberCredentials: true });
    }
  }, []);

  return (
    <>
      <Header leftSlot={<AuthGoBackBtn />} />
      <AuthForm
        onSubmit={handleSubmit((data: FormData) => login(data))}
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
            ControllerProps={{
              control,
              name: 'rememberCredentials',
            }}
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
