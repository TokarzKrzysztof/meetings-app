import {
  default as MuiTypography,
  TypographyProps as MuiTypographyProps,
  TypographyTypeMap,
} from '@mui/material/Typography';

export type TypographyProps<D extends React.ElementType = TypographyTypeMap['defaultComponent']> =
  MuiTypographyProps<D, { component?: D }> & {};

export const Typography = <D extends React.ElementType = TypographyTypeMap['defaultComponent']>({
  ...props
}: TypographyProps<D>) => <MuiTypography {...props}></MuiTypography>;
