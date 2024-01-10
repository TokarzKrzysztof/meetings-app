import {
  default as MuiOutlinedInput,
  OutlinedInputProps as MuiOutlinedInputProps
} from '@mui/material/OutlinedInput';

export type OutlinedInputProps = MuiOutlinedInputProps & {};

export const OutlinedInput = ({ ...props }: OutlinedInputProps) => (
  <MuiOutlinedInput {...props}></MuiOutlinedInput>
);
