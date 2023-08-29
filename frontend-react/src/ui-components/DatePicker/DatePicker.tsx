import {
  DatePicker as MuiDatePicker,
  DatePickerProps as MuiDatePickerProps,
} from '@mui/x-date-pickers';

export type DatePickerProps<TDate> = MuiDatePickerProps<TDate> & {};

export const DatePicker = <TDate,>({
  slotProps,
  ...props
}: DatePickerProps<TDate>) => (
  <MuiDatePicker
    slotProps={{
      textField: {
        variant: 'standard',
        fullWidth: true,
        ...slotProps?.textField,
      },
    }}
    timezone='UTC'
    {...props}
  ></MuiDatePicker>
);
