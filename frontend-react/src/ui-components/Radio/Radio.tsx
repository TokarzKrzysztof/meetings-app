import {
  default as MuiRadio,
  RadioProps as MuiRadioProps
} from '@mui/material/Radio';

export type RadioProps = MuiRadioProps & {};

export const Radio = ({ ...props }: RadioProps) => (
  <MuiRadio {...props}></MuiRadio>
);
