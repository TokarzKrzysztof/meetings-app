import {
  ContainerTypeMap,
  default as MuiContainer,
  ContainerProps as MuiContainerProps,
} from '@mui/material/Container';
import { ForwardedRef } from 'react';
import { typedForwardRef } from 'src/utils/types/forward-ref';

export type ContainerProps<D extends React.ElementType = ContainerTypeMap['defaultComponent']> =
  MuiContainerProps<D, { component?: D }> & {
    disableVerticalSpacing?: boolean;
  };

const ContainerInner = <D extends React.ElementType = ContainerTypeMap['defaultComponent']>(
  { sx, disableVerticalSpacing, ...props }: ContainerProps<D>,
  ref: ForwardedRef<HTMLDivElement>
) => (
  <MuiContainer
    ref={ref}
    sx={{ py: disableVerticalSpacing ? undefined : 2, ...sx }}
    {...props}
  ></MuiContainer>
);

export const Container = typedForwardRef(ContainerInner);
