import {
  default as MuiList,
  ListProps as MuiListProps,
  ListTypeMap,
} from '@mui/material/List';

export type ListProps<
  D extends React.ElementType = ListTypeMap['defaultComponent']
> = MuiListProps<D, { component?: D }> & {};

export const List = <
  D extends React.ElementType = ListTypeMap['defaultComponent']
>({
  ...props
}: ListProps<D>) => (
  <MuiList {...props}></MuiList>
);
