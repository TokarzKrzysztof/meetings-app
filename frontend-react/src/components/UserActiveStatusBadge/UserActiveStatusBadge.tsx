import { User, UserActiveStatus } from 'src/models/user';
import { Badge } from 'src/ui-components';
import { PropsWithReactElement } from 'src/utils/types/props';

export type UserActiveStatusBadgeProps = PropsWithReactElement<{
  status: User['activeStatus'];
}>;

export const UserActiveStatusBadge = ({ status, children }: UserActiveStatusBadgeProps) => {
  return (
    <Badge
      overlap='circular'
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      variant='dot'
      invisible={status === UserActiveStatus.Offline}
      sx={(theme) => ({
        '& .MuiBadge-badge': {
          backgroundColor:
            status === UserActiveStatus.Online ? theme.palette.success.main : '#ff8000',
          boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        },
      })}
    >
      {children}
    </Badge>
  );
};
