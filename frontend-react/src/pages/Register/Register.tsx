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
import { User } from 'src/models/user';
import { RegisterPasswords } from 'src/pages/Register/RegisterPasswords/RegisterPasswords';
import { useRegisterUser } from 'src/queries/user-queries';
import { Button } from 'src/ui-components';
import { AppRoutes } from 'src/utils/enums/app-routes';
import { ValidationMessages } from 'src/utils/helpers/validation-messages';
import { ValidationPatterns } from 'src/utils/helpers/validation-patterns';
import { Validators } from 'src/utils/helpers/validators';

export async function loader() {
  return null;
}

export const Register = () => {
  const form = useForm<User>();
  const { register, handleSubmit, control } = form;
  const navigate = useNavigate();
  const {
    registerUser,
    registerUserError,
    registerUserReset,
    registerUserInProgress,
  } = useRegisterUser({
    onSuccess: () => navigate(AppRoutes.Login),
  });

  return (
    <>
      <Header leftSlot={<AuthGoBackBtn />} />
      <AuthForm
        onSubmit={handleSubmit((data) => registerUser(data))}
        onChange={() => registerUserError && registerUserReset()}
      >
        <AuthIcon iconName='person_add'></AuthIcon>
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
          label={'Imię'}
          {...register('firstName', {
            required: ValidationMessages.required,
          })}
        ></FormField>
        <FormField
          form={form}
          label={'Nazwisko'}
          {...register('lastName', { required: ValidationMessages.required })}
        ></FormField>
        <RegisterPasswords form={form} />
        <ControlledFormField
          element='datePicker'
          label={'Data urodzenia'}
          ControllerProps={{
            control,
            name: 'birthDate',
            rules: {
              required: ValidationMessages.required,
              validate: Validators.maxDate,
            },
          }}
          ElementProps={{
            disableFuture: true,
          }}
        ></ControlledFormField>
        <AuthButton disabled={registerUserInProgress}>
          Zarejestruj się
        </AuthButton>
        <AuthRedirectInfo>
          Masz już konto?{' '}
          <Button variant='text' component={Link} to={AppRoutes.Login}>
            Zaloguj się
          </Button>
        </AuthRedirectInfo>
      </AuthForm>
    </>
  );
};

Register.displayName = 'Register';
