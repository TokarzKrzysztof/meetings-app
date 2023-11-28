import { FieldPath, FieldValues } from 'react-hook-form';
import {
  Checkbox,
  CheckboxProps,
  FormControlLabel,
  FormControlLabelProps,
} from 'src/ui-components';
import { ControlledFieldProps } from 'src/utils/types/controlled-field-props';

export type CheckboxFieldProps = CheckboxProps & {
  FormControlLabelProps?: FormControlLabelProps;
};

export const CheckboxField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  label,
  controller: { field },
  FormControlLabelProps,
  ...props
}: CheckboxFieldProps & ControlledFieldProps<TFieldValues, TName>) => {
  return (
    <FormControlLabel
      label={label}
      slotProps={{ typography: { sx: { fontSize: 13 } } }}
      control={
        <Checkbox
          checked={!!field.value}
          onChange={(e) => field.onChange(e.target.checked)}
          size='small'
          {...props}
        />
      }
      {...FormControlLabelProps}
    />
  );
};
