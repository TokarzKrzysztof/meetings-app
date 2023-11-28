import {
  ContainerTypeMap,
  default as MuiContainer,
  ContainerProps as MuiContainerProps,
} from '@mui/material/Container';
import { ForwardedRef } from 'react';
import { typedForwardRef } from 'src/utils/types/forward-ref';

export type ContainerProps = {};

const ContainerInner = <D extends React.ElementType = ContainerTypeMap['defaultComponent']>(
  { ...props }: MuiContainerProps<D, { component?: D }> & ContainerProps,
  ref: ForwardedRef<HTMLDivElement>
) => <MuiContainer {...props} ref={ref}></MuiContainer>;

export const Container = typedForwardRef(ContainerInner);
