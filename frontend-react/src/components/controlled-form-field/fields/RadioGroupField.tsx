import { FieldPath, FieldValues } from 'react-hook-form';
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
  RadioGroupProps,
} from 'src/ui-components';
import {
  ControlledFieldProps,
  FormFieldSpacingProps,
} from 'src/utils/types/controlled-field-props';

export type RadioGroupFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
> = RadioGroupProps &
  FormFieldSpacingProps & {
    options: readonly { label: string; value: TFieldValues[TName] }[];
    isVertical?: boolean;
  };

export const RadioGroupField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  label,
  controller: { field, fieldState },
  options,
  hasTopSpacing,
  hasBottomSpacing,
  isVertical = false,
}: RadioGroupFieldProps<TFieldValues, TName> & ControlledFieldProps<TFieldValues, TName>) => {
  const onChange = (value: string) => {
    const isValueNumber = options.every((x) => typeof x.value === 'number');
    if (isValueNumber) {
      field.onChange(+value);
    } else {
      field.onChange(value === '' ? null : value);
    }
  };

  return (
    <FormControl
      error={!!fieldState.error}
      variant='standard'
      sx={{ mt: hasTopSpacing ? 2 : undefined, mb: hasBottomSpacing ? 2 : undefined }}
      fullWidth
    >
      <FormLabel>{label}</FormLabel>
      <RadioGroup
        row={!isVertical}
        onChange={(a, value) => onChange(value)}
        value={field.value ?? ''}
      >
        {options.map(({ label, value }) => (
          <FormControlLabel key={value} value={value ?? ''} control={<Radio />} label={label} />
        ))}
      </RadioGroup>
      <FormHelperText sx={{ mt: 0 }}>{fieldState.error?.message ?? ' '}</FormHelperText>
    </FormControl>
  );
};
