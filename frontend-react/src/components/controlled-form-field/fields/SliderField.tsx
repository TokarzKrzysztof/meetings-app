import { ReactNode } from 'react';
import { FieldPath, FieldValues } from 'react-hook-form';
import { FormControl, FormHelperText, FormLabel, Slider, SliderProps } from 'src/ui-components';
import { ControlledFieldProps } from 'src/utils/types/controlled-field-props';

export type SliderFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
> = SliderProps & {
  isRange?: boolean;
  renderPreview: (value: TFieldValues[TName]) => ReactNode;
};

export const SliderField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  label,
  controller: { field, fieldState },
  isRange,
  renderPreview,
  ...props
}: SliderFieldProps<TFieldValues, TName> & ControlledFieldProps<TFieldValues, TName>) => {
  const defaultValue = field.value ?? (isRange ? [0, 0] : 0);

  return (
    <FormControl error={!!fieldState.error} variant='standard' fullWidth>
      <FormLabel sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>{label}</span>
        {renderPreview(field.value)}
      </FormLabel>
      <Slider
        value={defaultValue}
        onChange={(e, value) => field.onChange(value)}
        valueLabelDisplay='auto'
        disableSwap
        {...props}
      ></Slider>
      <FormHelperText sx={{ mt: 0 }}>{fieldState.error?.message ?? ' '}</FormHelperText>
    </FormControl>
  );
};
