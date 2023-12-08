import { default as MuiStack, StackProps as MuiStackProps } from '@mui/material/Stack';
import { ForwardedRef } from 'react';
import { typedForwardRef } from 'src/utils/types/forward-ref';

export type StackProps<D extends React.ElementType> = MuiStackProps<D, { component?: D }> & {};

const StackInner = <D extends React.ElementType>(
  { direction = 'row', ...props }: StackProps<D>,
  ref: ForwardedRef<HTMLDivElement>
) => <MuiStack direction={direction} {...props} ref={ref}></MuiStack>;

export const Stack = typedForwardRef(StackInner);
