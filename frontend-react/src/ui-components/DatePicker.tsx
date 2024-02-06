import { DesktopDatePicker, DesktopDatePickerProps } from '@mui/x-date-pickers';

export type DatePickerProps<TDate> = DesktopDatePickerProps<TDate> & {};

export const DatePicker = <TDate,>({ slotProps, ...props }: DatePickerProps<TDate>) => (
  <DesktopDatePicker
    slotProps={{
      textField: {
        variant: 'standard',
        fullWidth: true,
        ...slotProps?.textField,
      },
    }}
    timezone='UTC'
    {...props}
  ></DesktopDatePicker>
);
