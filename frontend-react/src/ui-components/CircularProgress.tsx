import {
  default as MuiCircularProgress,
  CircularProgressProps as MuiCircularProgressProps,
} from '@mui/material/CircularProgress';

export type CircularProgressProps = {};

export const CircularProgress = ({
  ...props
}: MuiCircularProgressProps & CircularProgressProps) => (
  <MuiCircularProgress {...props}></MuiCircularProgress>
);
