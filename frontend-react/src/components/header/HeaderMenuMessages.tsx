import { Link } from 'react-router-dom';
import { useSignalRActions } from 'src/hooks/signalR/useSignalRActions';
import { useSignalREffect } from 'src/hooks/signalR/useSignalREffect';
import { useGetUnreadChatsCount } from 'src/queries/chat-queries';
import { Badge, Icon, IconButton } from 'src/ui-components';
import { AppRoutes } from 'src/utils/enums/app-routes';

export type HeaderMenuMessagesProps = {};

// this component can be rendered only for logged in user!
export const HeaderMenuMessages = ({ ...props }: HeaderMenuMessagesProps) => {
  const { unreadChatsCount, unreadChatsCountRefetch } = useGetUnreadChatsCount();
  const { startListenNewChat } = useSignalRActions();

  useSignalREffect('onNewChatCreated', (chatId) => {
    startListenNewChat({ chatId });
  });

  useSignalREffect('onGetNewMessage', () => {
    unreadChatsCountRefetch();
  });

  return (
    <IconButton size='large' slot='end' color='inherit' component={Link} to={AppRoutes.MyChatsPrivate()}>
      <Badge badgeContent={unreadChatsCount} color='error'>
        <Icon name='question_answer' />
      </Badge>
    </IconButton>
  );
};
