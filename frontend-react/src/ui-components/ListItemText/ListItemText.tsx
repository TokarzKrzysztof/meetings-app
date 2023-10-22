import {
  default as MuiListItemText,
  ListItemTextProps as MuiListItemTextProps
} from '@mui/material/ListItemText';
import { ElementType } from 'react';

export type ListItemTextProps<
  PrimaryTypographyComponent extends ElementType = 'span',
  SecondaryTypographyComponent extends ElementType = 'p'
> = MuiListItemTextProps<
  PrimaryTypographyComponent,
  SecondaryTypographyComponent
> & {};

export const ListItemText = <
  PrimaryTypographyComponent extends ElementType = 'span',
  SecondaryTypographyComponent extends ElementType = 'p'
>({
  ...props
}: ListItemTextProps<
  PrimaryTypographyComponent,
  SecondaryTypographyComponent
>) => <MuiListItemText {...props}></MuiListItemText>;
