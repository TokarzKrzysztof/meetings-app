import { useMemo } from 'react';
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
import { ControlledFieldProps } from 'src/utils/types/controlled-field-props';

export type RadioGroupFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
> = RadioGroupProps & {
  options: { label: string; value: TFieldValues[TName] }[];
};

export const RadioGroupField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  label,
  controller: { field, fieldState },
  options
}: RadioGroupFieldProps<TFieldValues, TName> &
  ControlledFieldProps<TFieldValues, TName>) => {
  const valueAsNumber = useMemo(
    () => options.every((x) => typeof x.value === 'number'),
    [options]
  );
  return (
    <FormControl error={!!fieldState.error} variant={'standard'}>
      <FormLabel>{label}</FormLabel>
      <RadioGroup
        row
        onChange={(a, value) => field.onChange(valueAsNumber ? +value : value)}
        value={field.value ?? null}
      >
        {options.map(({ label, value }) => (
          <FormControlLabel
            key={value}
            value={value}
            control={<Radio />}
            label={label}
          />
        ))}
      </RadioGroup>
      <FormHelperText sx={{ mt: 0 }}>
        {fieldState.error?.message ?? ' '}
      </FormHelperText>
    </FormControl>
  );
};
