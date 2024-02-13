import _ from 'lodash';
import { useEffect, useState } from 'react';
import { FieldPath, FieldValues } from 'react-hook-form';
import { Autocomplete, TextField } from 'src/ui-components';
import { ControlledFieldProps } from 'src/utils/types/controlled-field-props';

export type AutocompleteFieldProps<TOption> = {
  optionsAsync: TOption[] | undefined;
  getOptionLabel: (opt: TOption) => string;
  getOptionDisabled?: (opt: TOption) => boolean;
  disabledOnBottom?: boolean;
  valueKey?: keyof TOption;
  helperText?: string;
  disabled?: boolean;
};

type SelectOption = { label: string; value: string; disabled: boolean };

export const AutocompleteField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TOption = unknown
>({
  label,
  controller: { field, fieldState },
  optionsAsync,
  getOptionLabel,
  getOptionDisabled,
  disabledOnBottom,
  valueKey = 'id' as keyof TOption,
  helperText,
  disabled,
  ...props
}: AutocompleteFieldProps<TOption> & ControlledFieldProps<TFieldValues, TName>) => {
  const [options, setOptions] = useState<SelectOption[]>();

  useEffect(() => {
    if (optionsAsync) {
      let arr = optionsAsync.map((x) => ({
        label: getOptionLabel(x),
        value: x[valueKey] as string,
        disabled: getOptionDisabled ? getOptionDisabled(x) : false,
      }));
      if (disabledOnBottom) {
        arr = _.orderBy(arr, (x) => x.disabled);
      }

      setOptions(arr);
    }
  }, [optionsAsync]);

  const selectedOption = options?.find((x) => x.value === field.value) ?? null;
  return (
    <Autocomplete
      disabled={disabled}
      optionsAsync={options}
      getOptionLabel={(x) => x.label}
      getOptionDisabled={(x) => x.disabled}
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
          helperText={fieldState.error?.message ?? helperText ?? ' '}
        />
      )}
      {...props}
    />
  );
};
