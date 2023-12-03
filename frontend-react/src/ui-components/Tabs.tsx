import {
  default as MuiTabs,
  TabsProps as MuiTabsProps,
  TabsTypeMap,
} from '@mui/material/Tabs';

export type TabsProps<
  D extends React.ElementType = TabsTypeMap['defaultComponent'],
> = MuiTabsProps<D, { component?: D }> & {};

export const Tabs = <
  D extends React.ElementType = TabsTypeMap['defaultComponent'],
>({
  ...props
}: TabsProps<D>) => <MuiTabs {...props}></MuiTabs>;
