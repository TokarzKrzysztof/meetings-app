import { default as MuiBox, BoxProps as MuiBoxProps } from '@mui/material/Box';
import { BoxTypeMap } from '@mui/system';

export type BoxProps = {};

export const Box = <
  D extends React.ElementType = BoxTypeMap['defaultComponent']
>({
  ...props
}: MuiBoxProps<D, { component?: D }> & BoxProps) => (
  <MuiBox {...props}></MuiBox>
);
