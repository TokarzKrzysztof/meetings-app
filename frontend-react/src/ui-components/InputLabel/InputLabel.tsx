import {
  InputLabelTypeMap,
  default as MuiInputLabel,
  InputLabelProps as MuiInputLabelProps,
} from '@mui/material/InputLabel';

export type InputLabelProps = {};

export const InputLabel = <
  D extends React.ElementType = InputLabelTypeMap['defaultComponent']
>({
  ...props
}: MuiInputLabelProps<D, { component?: D }> & InputLabelProps) => (
  <MuiInputLabel {...props}></MuiInputLabel>
);
