import { default as MuiStack, StackProps as MuiStackProps } from '@mui/material/Stack';
import { ForwardedRef } from 'react';
import { typedForwardRef } from 'src/utils/types/forward-ref';

export type StackProps = MuiStackProps<'div', { component?: 'div' }> & {};

const StackInner = (
  { direction = 'row', ...props }: StackProps,
  ref: ForwardedRef<HTMLDivElement>
) => <MuiStack direction={direction} {...props} ref={ref}></MuiStack>;

export const Stack = typedForwardRef(StackInner);
