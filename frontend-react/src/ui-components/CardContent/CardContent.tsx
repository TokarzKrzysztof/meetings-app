import {
  default as MuiCardContent,
  CardContentProps as MuiCardContentProps,
  CardContentTypeMap,
} from '@mui/material/CardContent';

export type CardContentProps<
  D extends React.ElementType = CardContentTypeMap['defaultComponent']
> = MuiCardContentProps<D, { component?: D }> & {};

export const CardContent = <
  D extends React.ElementType = CardContentTypeMap['defaultComponent']
>({
  ...props
}: CardContentProps<D>) => (
  <MuiCardContent {...props}></MuiCardContent>
);
