import { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField } from 'src/components/FormField/FormField';
import { User } from 'src/models/user';
import { useAuthGetPasswordMinLength } from 'src/queries/auth-queries';
import { Icon, IconButton, InputAdornment } from 'src/ui-components';
import { ValidationMessages } from 'src/utils/helpers/validation-messages';

export type RegisterPasswordsProps = {
  form: UseFormReturn<User, any, undefined>;
};

export const RegisterPasswords = ({ form }: RegisterPasswordsProps) => {
  const {
    register,
    getValues,
    watch,
    trigger,
    formState: { isSubmitted },
  } = form;
  const [password, passwordRepeat] = watch(['password', 'passwordRepeat']);
  const [showPassword, setShowPassword] = useState(false);
  const { passwordMinLength } = useAuthGetPasswordMinLength();

  useEffect(() => {
    if (isSubmitted) trigger('passwordRepeat');
  }, [password]);

  useEffect(() => {
    if (isSubmitted) trigger('password');
  }, [passwordRepeat]);

  const visibilityButton = (
    <InputAdornment position='end'>
      <IconButton onClick={() => setShowPassword((show) => !show)} edge='end'>
        {showPassword ? (
          <Icon name='visibility_off' />
        ) : (
          <Icon name='visibility' />
        )}
      </IconButton>
    </InputAdornment>
  );

  return (
    <>
      <FormField
        form={form}
        label={'Hasło'}
        InputProps={{
          endAdornment: visibilityButton,
        }}
        {...register('password', {
          required: ValidationMessages.required,
          minLength: {
            value: passwordMinLength ?? 0,
            message: `Minimalna długość hasła to ${passwordMinLength} znaków`,
          },
          validate: (value: string) => {
            if (getValues('passwordRepeat') !== value) {
              return ValidationMessages.passwordsNotMatch;
            }
          },
        })}
        type={showPassword ? 'text' : 'password'}
      ></FormField>
      <FormField
        form={form}
        label={'Powtórz hasło'}
        InputProps={{
          endAdornment: visibilityButton,
        }}
        {...register('passwordRepeat', {
          required: ValidationMessages.required,
          validate: (value: string) => {
            if (getValues('password') !== value) {
              return ValidationMessages.passwordsNotMatch;
            }
          },
        })}
        type={showPassword ? 'text' : 'password'}
      ></FormField>
    </>
  );
};
