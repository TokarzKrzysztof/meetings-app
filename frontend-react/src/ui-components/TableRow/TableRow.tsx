import {
  default as MuiTableRow,
  TableRowProps as MuiTableRowProps,
  TableRowTypeMap,
} from '@mui/material/TableRow';

export type TableRowProps = {};

export const TableRow = <
  D extends React.ElementType = TableRowTypeMap['defaultComponent']
>({
  ...props
}: MuiTableRowProps<D, { component?: D }> & TableRowProps) => (
  <MuiTableRow {...props}></MuiTableRow>
);
