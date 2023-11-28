import { FieldPath, FieldValues } from 'react-hook-form';
import { TextArea, TextFieldProps } from 'src/ui-components';
import { Validators } from 'src/utils/helpers/validators';
import { ControlledFieldProps } from 'src/utils/types/controlled-field-props';

export type TextareaFieldProps = Omit<
  TextFieldProps<'outlined'>,
  'variant' | 'ref' | 'value' | 'onChange'
>;

export const TextareaField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  label,
  controller: { field, fieldState },
  sx,
  InputProps,
  ...props
}: TextareaFieldProps & ControlledFieldProps<TFieldValues, TName>) => {
  const helperText = fieldState.error
    ? fieldState.error.message
    : `Ilość znaków ${(field.value ?? '').length}/${Validators.maxStringLength.value}`;
  return (
    <TextArea
      fullWidth
      ref={field.ref}
      name={field.name}
      onChange={field.onChange}
      value={field.value ?? ''}
      label={label}
      error={!!fieldState.error}
      helperText={helperText}
      minRows={5}
      maxRows={20}
      sx={{ mt: 2, ...sx }}
      {...props}
    />
  );
};
