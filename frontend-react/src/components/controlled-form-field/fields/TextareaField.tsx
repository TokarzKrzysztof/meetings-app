import { FieldPath, FieldValues } from 'react-hook-form';
import { TextArea, TextFieldProps } from 'src/ui-components';
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
  return (
    <TextArea
      fullWidth
      ref={field.ref}
      name={field.name}
      onChange={field.onChange}
      value={field.value ?? ''}
      label={label}
      error={!!fieldState.error}
      helperText={fieldState.error?.message}
      minRows={5}
      maxRows={20}
      showAmountOfCharacters
      sx={{ mt: 2, ...sx }}
      {...props}
    />
  );
};
