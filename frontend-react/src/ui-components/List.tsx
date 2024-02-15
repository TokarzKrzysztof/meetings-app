import { ListTypeMap, default as MuiList, ListProps as MuiListProps } from '@mui/material/List';
import { ForwardedRef } from 'react';
import { typedForwardRef } from 'src/utils/types/forward-ref';

export type ListProps<D extends React.ElementType = ListTypeMap['defaultComponent']> = MuiListProps<
  D,
  { component?: D }
> & {};

export const ListInner = <D extends React.ElementType = ListTypeMap['defaultComponent']>(
  { ...props }: ListProps<D>,
  ref: ForwardedRef<HTMLUListElement>
) => <MuiList {...props} ref={ref}></MuiList>;

export const List = typedForwardRef(ListInner);
