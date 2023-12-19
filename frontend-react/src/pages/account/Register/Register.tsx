import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { FormField } from 'src/components/FormField';
import { ControlledFormField } from 'src/components/controlled-form-field/ControlledFormField';
import { Header } from 'src/components/header/Header';
import { User } from 'src/models/user';
import { RegisterSuccess } from 'src/pages/account/Register/RegisterSuccess';
import { AuthButton } from 'src/pages/account/shared/AuthButton';
import { AuthForm } from 'src/pages/account/shared/AuthForm';
import { AuthGoToMainPageBtn } from 'src/pages/account/shared/AuthGoToMainPageBtn';
import { AuthIcon } from 'src/pages/account/shared/AuthIcon';
import { AuthRedirectInfo } from 'src/pages/account/shared/AuthRedirectInfo';
import { PasswordFields } from 'src/pages/account/shared/PasswordFields';
import { useRegister } from 'src/queries/auth-queries';
import { Button, Typography } from 'src/ui-components';
import { AppRoutes } from 'src/utils/enums/app-routes';
import { ValidationMessages } from 'src/utils/helpers/validation-messages';
import { ValidationPatterns } from 'src/utils/helpers/validation-patterns';
import { Validators } from 'src/utils/helpers/validators';
import { genderOptions } from 'src/utils/user-utils';

export const Register = () => {
  const form = useForm<User>();
  const { register, handleSubmit, control } = form;
  const {
    registerUser,
    registerUserError,
    registerUserReset,
    registerUserInProgress,
    registerUserResult,
  } = useRegister();

  if (registerUserResult) {
    return <RegisterSuccess email={registerUserResult} />;
  }

  return (
    <>
      <Header leftSlot={<AuthGoToMainPageBtn />} />
      <AuthForm
        onSubmit={handleSubmit((data: User) => registerUser(data))}
        onChange={() => registerUserError && registerUserReset()}
      >
        <AuthIcon iconName='person_add'></AuthIcon>
        <FormField
          form={form}
          label='Email'
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
          label='Imię'
          {...register('firstName', {
            required: ValidationMessages.required,
          })}
        ></FormField>
        <FormField
          form={form}
          label='Nazwisko'
          {...register('lastName', { required: ValidationMessages.required })}
        ></FormField>
        <PasswordFields
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          form={form as any}
          labels={['Hasło', 'Powtórz hasło']}
        />
        <ControlledFormField
          control={control}
          element='date-picker'
          name='birthDate'
          label='Data urodzenia'
          rules={{
            required: ValidationMessages.required,
            validate: Validators.maxDate,
          }}
          ElementProps={{
            disableFuture: true,
          }}
        ></ControlledFormField>
        <ControlledFormField
          control={control}
          element='radio-group'
          name='gender'
          label='Płeć'
          rules={{ required: ValidationMessages.required }}
          ElementProps={{
            options: genderOptions,
          }}
        ></ControlledFormField>
        {registerUserError?.validationErrors.includes('EmailTaken') && (
          <Typography color='error'>Użytkownik z podanym adresem email już istnieje</Typography>
        )}
        <AuthButton disabled={registerUserInProgress}>Zarejestruj się</AuthButton>
        <AuthRedirectInfo>
          Masz już konto?{' '}
          <Button variant='text' component={Link} to={AppRoutes.Login()}>
            Zaloguj się
          </Button>
        </AuthRedirectInfo>
      </AuthForm>
    </>
  );
};

Register.displayName = 'Register';
