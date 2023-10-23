import {
  default as MuiTableContainer,
  TableContainerProps as MuiTableContainerProps,
  TableContainerTypeMap,
} from '@mui/material/TableContainer';

export type TableContainerProps = {};

export const TableContainer = <
  D extends React.ElementType = TableContainerTypeMap['defaultComponent'],
>({
  ...props
}: MuiTableContainerProps<D, { component?: D }> & TableContainerProps) => (
  <MuiTableContainer {...props}></MuiTableContainer>
);
