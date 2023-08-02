import {
  ContainerTypeMap,
  default as MuiContainer,
  ContainerProps as MuiContainerProps,
} from '@mui/material/Container';

export type ContainerProps = {};

export const Container = <
  D extends React.ElementType = ContainerTypeMap['defaultComponent']
>({
  ...props
}: MuiContainerProps<D, { component?: D }> & ContainerProps) => (
  <MuiContainer {...props}></MuiContainer>
);
