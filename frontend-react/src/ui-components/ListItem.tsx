import {
  ListItemTypeMap,
  default as MuiListItem,
  ListItemProps as MuiListItemProps,
} from '@mui/material/ListItem';

export type ListItemProps<
  D extends React.ElementType = ListItemTypeMap<{}, 'li'>['defaultComponent'],
> = MuiListItemProps<D, { component?: D }> & {};

export const ListItem = <
  D extends React.ElementType = ListItemTypeMap<{}, 'li'>['defaultComponent'],
>({
  ...props
}: ListItemProps<D>) => <MuiListItem {...props}></MuiListItem>;
