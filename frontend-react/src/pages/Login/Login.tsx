import { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { AuthButton } from 'src/components/AuthButton/AuthButton';
import { AuthForm } from 'src/components/AuthForm/AuthForm';
import { AuthGoBackBtn } from 'src/components/AuthGoBackBtn/AuthGoBackBtn';
import { AuthIcon } from 'src/components/AuthIcon/AuthIcon';
import { FormField } from 'src/components/FormField/FormField';
import { Header } from 'src/components/Header/Header';
import { AuthService } from 'src/http-services/auth-service';
import { LoginCredentials } from 'src/models/login-credentials';
import { Typography } from 'src/ui-components';
import { AppRoutes } from 'src/utils/enums/app-routes';
import { ValidationMessages } from 'src/utils/helpers/validation-messages';
import { ValidationPatterns } from 'src/utils/helpers/validation-patterns';
import { HttpErrorData } from 'src/utils/types/http-error-data';

export async function loader() {
  return null;
}

export const Login = () => {
  const form = useForm<LoginCredentials>();
  const { register, handleSubmit } = form;
  const navigate = useNavigate();

  const mutation = useMutation<
    any,
    AxiosError<HttpErrorData>,
    LoginCredentials,
    unknown
  >({
    mutationFn: (data) => {
      return AuthService.login(data);
    },
    onSuccess: () => {
      navigate(AppRoutes.Home);
    },
  });

  return (
    <>
      <Header leftSlot={<AuthGoBackBtn />} />
      <AuthForm
        onSubmit={handleSubmit((data) => mutation.mutate(data))}
        onChange={() => mutation.error && mutation.reset()}
      >
        <AuthIcon></AuthIcon>
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
        {mutation.error?.response?.data?.statusCode === 401 && (
          <Typography color={'error'}>
            Email i/lub hasło są nieprawidłowe
          </Typography>
        )}
        <AuthButton disabled={mutation.isLoading}>Zaloguj</AuthButton>
      </AuthForm>
    </>
  );
};

Login.displayName = 'Login';
