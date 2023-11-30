import {
  default as MuiStack,
  StackProps as MuiStackProps,
  StackTypeMap,
} from '@mui/material/Stack';
import { ForwardedRef } from 'react';
import { typedForwardRef } from 'src/utils/types/forward-ref';

export type StackProps = {};

const StackInner = <D extends React.ElementType = StackTypeMap['defaultComponent']>(
  { direction = 'row', ...props }: MuiStackProps<D, { component?: D }> & StackProps,
  ref: ForwardedRef<HTMLDivElement>
) => <MuiStack direction={direction} {...props} ref={ref}></MuiStack>;

export const Stack = typedForwardRef(StackInner);
