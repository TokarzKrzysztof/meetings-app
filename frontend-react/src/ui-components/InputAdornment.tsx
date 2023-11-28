import {
  default as MuiInputAdornment,
  InputAdornmentProps as MuiInputAdornmentProps,
  InputAdornmentTypeMap,
} from '@mui/material/InputAdornment';

export type InputAdornmentProps<
  D extends React.ElementType = InputAdornmentTypeMap['defaultComponent'],
> = MuiInputAdornmentProps<D, { component?: D }> & {};

export const InputAdornment = <
  D extends React.ElementType = InputAdornmentTypeMap['defaultComponent'],
>({
  ...props
}: InputAdornmentProps<D>) => <MuiInputAdornment {...props}></MuiInputAdornment>;
