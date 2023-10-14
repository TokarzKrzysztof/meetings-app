import { ForwardedRef } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { TextField, TextFieldProps } from 'src/ui-components';
import { typedForwardRef } from 'src/utils/types/forward-ref';

export type FormFieldProps = Omit<TextFieldProps<'standard'>, 'ref'> & {
  form: UseFormReturn<any, any, undefined>;
  label: string;
};

const FormFieldInner = (
  { form, label, type, name, error, ...props }: FormFieldProps,
  ref: ForwardedRef<HTMLInputElement>
) => {
  const {
    formState: { errors },
  } = form;

  return (
    <TextField
      fullWidth
      type={type}
      variant='standard'
      label={label}
      ref={ref}
      name={name}
      error={error ?? !!errors[name!]}
      helperText={(errors[name!]?.message as string) ?? ' '}
      {...props}
    ></TextField>
  );
};

export const FormField = typedForwardRef(FormFieldInner);
