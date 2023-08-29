import dayjs, { Dayjs } from 'dayjs';
import {
  Control,
  FieldPath,
  FieldPathValue,
  FieldValues,
  RegisterOptions,
  useController,
} from 'react-hook-form';
import {
  Checkbox,
  CheckboxProps,
  DatePicker,
  DatePickerProps,
  FormControlLabel,
  FormControlLabelProps,
} from 'src/ui-components';

export type ControlledFormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  label: string;
  FormControlLabelProps?: FormControlLabelProps;
  ControllerProps: {
    control: Control<TFieldValues>;
    name: TName;
    rules?: Omit<
      RegisterOptions<TFieldValues, TName>,
      'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
    >;
    shouldUnregister?: boolean;
    defaultValue?: FieldPathValue<TFieldValues, TName>;
  };
} & (
  | {
      element: 'datePicker';
      ElementProps?: DatePickerProps<Dayjs>;
    }
  | {
      element: 'checkbox';
      ElementProps?: CheckboxProps;
    }
  | {
      element: 'sth';
      ElementProps?: {
        test: number;
      };
    }
);

export const ControlledFormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  label,
  element,
  ControllerProps,
  ElementProps,
  FormControlLabelProps,
  ...props
}: ControlledFormFieldProps<TFieldValues, TName>) => {
  const { field, fieldState } = useController(ControllerProps);

  if (element === 'datePicker') {
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
        {...ElementProps}
      />
    );
  }

  if (element === 'checkbox') {
    return (
      <FormControlLabel
        label={label}
        slotProps={{ typography: { sx: { fontSize: 13 } } }}
        control={
          <Checkbox
            checked={!!field.value}
            onChange={(e) => field.onChange(e.target.checked)}
            size={'small'}
            {...ElementProps}
          />
        }
        {...FormControlLabelProps}
      />
    );
  }

  return null;
};