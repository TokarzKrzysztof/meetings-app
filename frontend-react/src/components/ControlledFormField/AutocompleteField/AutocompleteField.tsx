import { FieldPath, FieldValues } from 'react-hook-form';
import { Autocomplete, AutocompleteProps, TextField } from 'src/ui-components';
import { ControlledFieldProps } from 'src/utils/types/controlled-field-props';

export type AutocompleteFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = AutocompleteProps<TFieldValues[TName]> & {
  compareKey?: keyof TFieldValues[TName];
};

export const AutocompleteField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  label,
  controller: { field, fieldState },
  optionsAsync,
  getOptionLabel,
  compareKey = 'id',
  ...props
}: AutocompleteFieldProps<TFieldValues, TName> &
  ControlledFieldProps<TFieldValues, TName>) => {
  return (
    <Autocomplete
      optionsAsync={optionsAsync}
      getOptionLabel={getOptionLabel}
      value={field.value ?? null}
      isOptionEqualToValue={(opt, current) =>
        opt[compareKey] === current[compareKey]
      }
      onChange={(_, value) => field.onChange(value)}
      renderInput={(params) => (
        <TextField
          {...params}
          variant='standard'
          label={label}
          inputRef={field.ref}
          fullWidth
          name={field.name}
          error={!!fieldState.error}
          helperText={fieldState.error?.message ?? ' '}
        />
      )}
      {...props}
    />
  );
};
