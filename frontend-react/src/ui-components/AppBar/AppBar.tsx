import {
  AppBarTypeMap,
  default as MuiAppBar,
  AppBarProps as MuiAppBarProps,
} from '@mui/material/AppBar';

export type AppBarProps = {};

export const AppBar = <
  D extends React.ElementType = AppBarTypeMap['defaultComponent']
>({
  ...props
}: MuiAppBarProps<D, { component?: D }> & AppBarProps) => (
  <MuiAppBar {...props}></MuiAppBar>
);
