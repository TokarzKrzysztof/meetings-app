import {
  default as MuiTableCell,
  TableCellProps as MuiTableCellProps,
} from '@mui/material/TableCell';

export type TableCellProps = {};

export const TableCell = ({ ...props }: MuiTableCellProps & TableCellProps) => (
  <MuiTableCell {...props}></MuiTableCell>
);
