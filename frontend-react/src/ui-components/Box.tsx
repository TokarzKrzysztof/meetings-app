import { default as MuiBox, BoxProps as MuiBoxProps } from '@mui/material/Box';
import { BoxTypeMap } from '@mui/system';
import { ForwardedRef } from 'react';
import { typedForwardRef } from 'src/utils/types/forward-ref';

export type BoxProps<D extends React.ElementType = BoxTypeMap['defaultComponent']> = MuiBoxProps<
  D,
  { component?: D }
> & {};

const BoxInner = <D extends React.ElementType = BoxTypeMap['defaultComponent']>(
  { ...props }: BoxProps<D>,
  ref: ForwardedRef<HTMLElement>
) => <MuiBox {...props} ref={ref}></MuiBox>;

export const Box = typedForwardRef(BoxInner);
