import { ReactNode, useState } from 'react';
import { FieldPath, FieldValues } from 'react-hook-form';
import { FormControl, FormHelperText, FormLabel, NumberInput, Slider, SliderProps } from 'src/ui-components';
import { ControlledFieldProps } from 'src/utils/types/controlled-field-props';

export type SliderFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
> = SliderProps & {
  isRange?: boolean;
  renderPreview: (value: TFieldValues[TName] | null) => ReactNode;
  inputEndAdornment?: ReactNode;
};

export const SliderField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  label,
  controller: { field, fieldState },
  isRange,
  renderPreview,
  inputEndAdornment,
  ...props
}: SliderFieldProps<TFieldValues, TName> & ControlledFieldProps<TFieldValues, TName>) => {
  const defaultSliderMax = 100;
  const [sliderMax, setSliderMax] = useState(
    field.value !== null && field.value > defaultSliderMax ? field.value : defaultSliderMax
  );

  return (
    <FormControl error={!!fieldState.error} variant='standard' fullWidth>
      <FormLabel sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>{label}</span>
        {renderPreview(field.value)}
      </FormLabel>
      <Slider
        value={field.value}
        onChange={(e, value) => field.onChange(value)}
        valueLabelDisplay='auto'
        max={sliderMax}
        disableSwap
        {...props}
      ></Slider>
      {!isRange && (
        <NumberInput
          size='small'
          value={field.value}
          onChange={(value) => {
            field.onChange(value);
            setSliderMax(value !== null && value > defaultSliderMax ? value : defaultSliderMax);
          }}
          endAdornment={inputEndAdornment}
          isInteger
          isPositive
        />
      )}
      <FormHelperText sx={{ mt: 0 }}>{fieldState.error?.message ?? ' '}</FormHelperText>
    </FormControl>
  );
};