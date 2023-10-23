import {
  Control,
  FieldPath,
  FieldValues,
  RegisterOptions,
  useController,
} from 'react-hook-form';
import {
  AutocompleteField,
  AutocompleteFieldProps,
} from 'src/components/ControlledFormField/AutocompleteField/AutocompleteField';
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
import {
  TextareaField,
  TextareaFieldProps,
} from 'src/components/ControlledFormField/TextareaField/TextareaField';

export type ControlledFormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TOther = unknown
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
  | {
      element: 'autocomplete';
      ElementProps: AutocompleteFieldProps<TOther>;
    }
  | {
      element: 'textarea';
      ElementProps?: TextareaFieldProps;
    }
);

export const ControlledFormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TOther = unknown
>({
  label,
  control,
  name,
  rules,
  shouldUnregister,
  element,
  ElementProps,
}: ControlledFormFieldProps<TFieldValues, TName, TOther>) => {
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

  if (element === 'autocomplete') {
    return (
      <AutocompleteField
        {...ElementProps}
        controller={controller}
        label={label}
      />
    );
  }

  if (element === 'textarea') {
    return (
      <TextareaField {...ElementProps} controller={controller} label={label} />
    );
  }

  return null;
};
