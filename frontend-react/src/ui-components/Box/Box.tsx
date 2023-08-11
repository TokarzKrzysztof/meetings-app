import { default as MuiBox, BoxProps as MuiBoxProps } from '@mui/material/Box';
import { BoxTypeMap } from '@mui/system';

export type BoxProps<
  D extends React.ElementType = BoxTypeMap['defaultComponent']
> = MuiBoxProps<D, { component?: D }> & {};

export const Box = <
  D extends React.ElementType = BoxTypeMap['defaultComponent']
>({
  ...props
}: BoxProps<D>) => <MuiBox {...props}></MuiBox>;
