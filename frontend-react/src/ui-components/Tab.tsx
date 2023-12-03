import {
  default as MuiTab,
  TabProps as MuiTabProps,
  TabTypeMap,
} from '@mui/material/Tab';

export type TabProps<
  D extends React.ElementType = TabTypeMap['defaultComponent'],
> = MuiTabProps<D, { component?: D }> & {};

export const Tab = <
  D extends React.ElementType = TabTypeMap['defaultComponent'],
>({
  ...props
}: TabProps<D>) => <MuiTab {...props}></MuiTab>;
