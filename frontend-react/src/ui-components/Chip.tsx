import { ChipTypeMap, default as MuiChip, ChipProps as MuiChipProps } from '@mui/material/Chip';
import { ForwardedRef } from 'react';
import { typedForwardRef } from 'src/utils/types/forward-ref';

export type ChipProps<D extends React.ElementType = ChipTypeMap['defaultComponent']> = MuiChipProps<
  D,
  { component?: D }
> & {};

export const ChipInner = <D extends React.ElementType = ChipTypeMap['defaultComponent']>(
  { ...props }: ChipProps<D>,
  ref: ForwardedRef<HTMLDivElement>
) => <MuiChip {...props} ref={ref}></MuiChip>;

export const Chip = typedForwardRef(ChipInner);
