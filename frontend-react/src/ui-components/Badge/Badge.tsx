import {
  BadgeTypeMap,
  default as MuiBadge,
  BadgeProps as MuiBadgeProps,
} from '@mui/material/Badge';

export type BadgeProps = {};

export const Badge = <D extends React.ElementType = BadgeTypeMap['defaultComponent']>({
  ...props
}: MuiBadgeProps<D, { component?: D }> & BadgeProps) => <MuiBadge {...props}></MuiBadge>;
