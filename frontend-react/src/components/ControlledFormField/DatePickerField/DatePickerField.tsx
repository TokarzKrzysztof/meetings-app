import dayjs, { Dayjs } from 'dayjs';
import { FieldPath, FieldValues } from 'react-hook-form';
import { DatePicker, DatePickerProps } from 'src/ui-components';
import { ControlledFieldProps } from 'src/utils/types/controlled-field-props';

export type DatePickerFieldProps = DatePickerProps<Dayjs>;

export const DatePickerField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  label,
  controller: { field, fieldState },
  ...props
}: DatePickerFieldProps & ControlledFieldProps<TFieldValues, TName>) => {
  return (
    <DatePicker
      label={label}
      value={field.value ? dayjs(field.value) : null}
      inputRef={field.ref}
      slotProps={{
        textField: {
          error: !!fieldState.error,
          helperText: fieldState.error?.message ?? ' ',
        },
      }}
      onChange={(date) => {
        if (date?.isValid()) {
          field.onChange(date.toISOString());
        } else {
          field.onChange(null);
        }
      }}
      {...props}
    />
  );
};
