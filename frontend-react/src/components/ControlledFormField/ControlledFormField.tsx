import {
  Control,
  FieldPath,
  FieldValues,
  RegisterOptions,
  useController,
} from 'react-hook-form';
import {
  CheckboxField,
  CheckboxFieldProps,
} from 'src/components/ControlledFormField/CheckboxField/CheckboxField';
import {
  DatePickerField,
  DatePickerFieldProps,
} from 'src/components/ControlledFormField/DatePickerField/DatePickerField';
import {
  RadioGroupField,
  RadioGroupFieldProps,
} from 'src/components/ControlledFormField/RadioGroupField/RadioGroupField';

export type ControlledFormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  label: string;
  control: Control<TFieldValues>;
  name: TName;
  rules?: Omit<
    RegisterOptions<TFieldValues, TName>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
  shouldUnregister?: boolean;
} & (
  | {
      element: 'date-picker';
      ElementProps?: DatePickerFieldProps;
    }
  | {
      element: 'checkbox';
      ElementProps?: CheckboxFieldProps;
    }
  | {
      element: 'radio-group';
      ElementProps: RadioGroupFieldProps<TFieldValues, TName>;
    }
);

export const ControlledFormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  label,
  control,
  name,
  rules,
  shouldUnregister,
  element,
  ElementProps,
}: ControlledFormFieldProps<TFieldValues, TName>) => {
  const controller = useController({ control, name, rules, shouldUnregister });

  if (element === 'date-picker') {
    return (
      <DatePickerField
        {...ElementProps}
        controller={controller}
        label={label}
      />
    );
  }

  if (element === 'checkbox') {
    return (
      <CheckboxField {...ElementProps} controller={controller} label={label} />
    );
  }

  if (element === 'radio-group') {
    return (
      <RadioGroupField
        {...ElementProps}
        controller={controller}
        label={label}
      />
    );
  }

  return null;
};
