import {
  default as MuiToolbar,
  ToolbarProps as MuiToolbarProps,
  ToolbarTypeMap,
} from '@mui/material/Toolbar';

export type ToolbarProps = {};

export const Toolbar = <D extends React.ElementType = ToolbarTypeMap['defaultComponent']>({
  ...props
}: MuiToolbarProps<D, { component?: D }> & ToolbarProps) => <MuiToolbar {...props}></MuiToolbar>;
