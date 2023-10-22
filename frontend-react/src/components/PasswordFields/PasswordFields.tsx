import { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField } from 'src/components/FormField/FormField';
import { Icon, IconButton, InputAdornment } from 'src/ui-components';
import { ValidationMessages } from 'src/utils/helpers/validation-messages';

export type PasswordFieldsFormData = {
  password: string;
  passwordRepeat: string;
};

export type PasswordFieldsProps = {
  form: UseFormReturn<PasswordFieldsFormData, any, undefined>;
  labels: [string, string];
};

export const PasswordFields = ({ form, labels }: PasswordFieldsProps) => {
  const {
    register,
    getValues,
    watch,
    trigger,
    formState: { isSubmitted },
  } = form;
  const [password, passwordRepeat] = watch(['password', 'passwordRepeat']);
  const [showPassword, setShowPassword] = useState(false);

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

  const passwordMinLength = 5;
  return (
    <>
      <FormField
        form={form}
        label={labels[0]}
        InputProps={{
          endAdornment: visibilityButton,
        }}
        {...register('password', {
          required: ValidationMessages.required,
          minLength: {
            value: passwordMinLength,
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
        label={labels[1]}
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
