import {
  default as MuiRadioGroup,
  RadioGroupProps as MuiRadioGroupProps,
} from '@mui/material/RadioGroup';

export type RadioGroupProps = MuiRadioGroupProps & {};

export const RadioGroup = ({ ...props }: RadioGroupProps) => (
  <MuiRadioGroup {...props}></MuiRadioGroup>
);
