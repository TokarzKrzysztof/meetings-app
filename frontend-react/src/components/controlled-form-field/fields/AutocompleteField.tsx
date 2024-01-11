import { useEffect, useState } from 'react';
import { FieldPath, FieldValues } from 'react-hook-form';
import { Autocomplete, TextField } from 'src/ui-components';
import { ControlledFieldProps } from 'src/utils/types/controlled-field-props';

export type AutocompleteFieldProps<TOption> = {
  valueKey?: keyof TOption;
  optionsAsync: TOption[] | undefined;
  getOptionLabel: (opt: TOption) => string;
};

type SelectOption = { label: string; value: string };

export const AutocompleteField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TOption = unknown,
>({
  label,
  controller: { field, fieldState },
  optionsAsync,
  getOptionLabel,
  valueKey = 'id' as keyof TOption,
  ...props
}: AutocompleteFieldProps<TOption> & ControlledFieldProps<TFieldValues, TName>) => {
  const [options, setOptions] = useState<SelectOption[]>();

  useEffect(() => {
    if (optionsAsync) {
      setOptions(
        optionsAsync.map((x) => ({
          label: getOptionLabel(x),
          value: x[valueKey] as string,
        })),
      );
    }
  }, [optionsAsync]);

  const selectedOption = options?.find((x) => x.value === field.value) ?? null;
  return (
    <Autocomplete
      optionsAsync={options}
      getOptionLabel={(x) => x.label}
      value={selectedOption}
      isOptionEqualToValue={(opt, current) => opt.value === current.value}
      onChange={(_, option) => {
        return field.onChange(option ? (option as SelectOption).value : null);
      }}
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
