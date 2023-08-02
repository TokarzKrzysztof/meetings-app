import {
  default as MuiTable,
  TableProps as MuiTableProps,
  TableTypeMap,
} from '@mui/material/Table';

export type TableProps = {};

export const Table = <
  D extends React.ElementType = TableTypeMap['defaultComponent']
>({
  ...props
}: MuiTableProps<D, { component?: D }> & TableProps) => (
  <MuiTable {...props}></MuiTable>
);
