import { atom, useAtom } from 'jotai';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UsersHttpAutocomplete } from 'src/components/UsersHttpAutocomplete';
import { Icon, IconButton, Stack } from 'src/ui-components';
import { AppRoutes } from 'src/utils/enums/app-routes';

export const showNewPrivateMessageAtom = atom(false);

export type MyChatsNewPrivateMessageProps = {};

export const MyChatsNewPrivateMessage = ({ ...props }: MyChatsNewPrivateMessageProps) => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [showNewPrivateMessage, setShowNewPrivateMessage] = useAtom(showNewPrivateMessageAtom);

  useEffect(() => {
    if (showNewPrivateMessage) inputRef.current!.focus();
  }, [showNewPrivateMessage]);

  return (
    <Stack
      sx={{
        position: 'absolute',
        top: 0,
        width: '100%',
        p: 1,
        transform: !showNewPrivateMessage ? 'translateY(-100%)' : undefined,
        transition: '300ms',
        background: 'white',
        zIndex: 1,
      }}
      justifyContent={'space-between'}
    >
      <UsersHttpAutocomplete
        onSelectUser={(user) => navigate(AppRoutes.PrivateChat({ userId: user.id }))}
        inputRef={inputRef}
      />
      <IconButton onClick={() => setShowNewPrivateMessage(false)}>
        <Icon name='close' />
      </IconButton>
    </Stack>
  );
};
