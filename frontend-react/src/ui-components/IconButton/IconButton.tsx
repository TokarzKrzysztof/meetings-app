import {
  IconButtonTypeMap,
  default as MuiIconButton,
  IconButtonProps as MuiIconButtonProps,
} from '@mui/material/IconButton';

export type IconButtonProps = {};

export const IconButton = <
  D extends React.ElementType = IconButtonTypeMap['defaultComponent']
>({
  ...props
}: MuiIconButtonProps<D, { component?: D }> & IconButtonProps) => (
  <MuiIconButton {...props}></MuiIconButton>
);