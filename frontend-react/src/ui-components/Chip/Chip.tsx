import {
  default as MuiChip,
  ChipProps as MuiChipProps,
  ChipTypeMap,
} from '@mui/material/Chip';

export type ChipProps<
  D extends React.ElementType = ChipTypeMap['defaultComponent'],
> = MuiChipProps<D, { component?: D }> & {};

export const Chip = <
  D extends React.ElementType = ChipTypeMap['defaultComponent'],
>({
  ...props
}: ChipProps<D>) => <MuiChip {...props}></MuiChip>;
