import {
  default as MuiTypography,
  TypographyProps as MuiTypographyProps,
  TypographyTypeMap,
} from '@mui/material/Typography';

export type TypographyProps = {};

export const Typography = <
  D extends React.ElementType = TypographyTypeMap['defaultComponent']
>({
  ...props
}: MuiTypographyProps<D, { component?: D }> & TypographyProps) => (
  <MuiTypography {...props}></MuiTypography>
);
