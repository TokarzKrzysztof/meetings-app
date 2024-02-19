import { Link } from 'react-router-dom';
import { useSignalREffect } from 'src/hooks/signalR/useSignalREffect';
import { useGetUnreadChatsCount } from 'src/queries/chat-participant-queries';
import { Badge, Icon, IconButton } from 'src/ui-components';
import { AppRoutes } from 'src/utils/enums/app-routes';

export type HeaderMenuMessagesProps = {};

// this component can be rendered only for logged in user!
export const HeaderMenuMessages = ({ ...props }: HeaderMenuMessagesProps) => {
  const { unreadChatsCount, unreadChatsCountRefetch } = useGetUnreadChatsCount();

  useSignalREffect('onGetNewMessage', () => {
    unreadChatsCountRefetch();
  });

  const badgeContent = unreadChatsCount ? unreadChatsCount.private + unreadChatsCount.group : null;
  return (
    <IconButton
      size='large'
      slot='end'
      color='inherit'
      component={Link}
      to={AppRoutes.MyChatsPrivate()}
    >
      <Badge badgeContent={badgeContent} color='error'>
        <Icon name='question_answer' />
      </Badge>
    </IconButton>
  );
};
