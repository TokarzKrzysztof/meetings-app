import {
  default as MuiLinearProgress,
  LinearProgressProps as MuiLinearProgressProps
} from '@mui/material/LinearProgress';

export type LinearProgressProps = MuiLinearProgressProps & {};

export const LinearProgress = ({ ...props }: LinearProgressProps) => (
  <MuiLinearProgress {...props}></MuiLinearProgress>
);
