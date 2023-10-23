import {
  CardTypeMap,
  default as MuiCard,
  CardProps as MuiCardProps,
} from '@mui/material/Card';

export type CardProps<
  D extends React.ElementType = CardTypeMap['defaultComponent']
> = MuiCardProps<D, { component?: D }> & {};

export const Card = <
  D extends React.ElementType = CardTypeMap['defaultComponent']
>({
  ...props
}: CardProps<D>) => (
  <MuiCard {...props}></MuiCard>
);
