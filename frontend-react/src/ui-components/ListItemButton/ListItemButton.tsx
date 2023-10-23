import {
  default as MuiListItemButton,
  ListItemButtonProps as MuiListItemButtonProps,
  ListItemButtonTypeMap,
} from '@mui/material/ListItemButton';

export type ListItemButtonProps<
  D extends React.ElementType = ListItemButtonTypeMap['defaultComponent'],
> = MuiListItemButtonProps<D, { component?: D }> & {};

export const ListItemButton = <
  D extends React.ElementType = ListItemButtonTypeMap['defaultComponent'],
>({
  ...props
}: ListItemButtonProps<D>) => <MuiListItemButton {...props}></MuiListItemButton>;
