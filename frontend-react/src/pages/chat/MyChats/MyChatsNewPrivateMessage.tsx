import { atom, useAtom } from 'jotai';
import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { HttpAutocomplete } from 'src/components/HttpAutocomplete';
import { User } from 'src/models/user';
import { useGetUsersByFilter } from 'src/queries/user-queries';
import { Avatar, Box, Icon, IconButton, Stack, TextField, Typography } from 'src/ui-components';
import { AppRoutes } from 'src/utils/enums/app-routes';

export const showNewPrivateMessageAtom = atom(false);

export type MyChatsNewPrivateMessageProps = {};

export const MyChatsNewPrivateMessage = ({ ...props }: MyChatsNewPrivateMessageProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [showNewPrivateMessage, setShowNewPrivateMessage] = useAtom(showNewPrivateMessageAtom);
  const { getUsersByFilter, getUsersByFilterResult, getUsersByFilterInProgress } =
    useGetUsersByFilter();

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
      }}
      justifyContent={'space-between'}
    >
      <HttpAutocomplete
        size='small'
        sx={{ flexGrow: 1, mr: 2 }}
        freeSolo
        disableClearable
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder='Wyszukaj użytkownika...'
            InputProps={{
              ...params.InputProps,
              startAdornment: <Icon name='search' fontSize='small' />,
            }}
            inputRef={inputRef}
          />
        )}
        renderOption={(props, opt) => (
          <Box {...props} component={'li'} key={opt.id}>
            <Avatar sx={{ mr: 1 }} src={opt.profileImageSrc} size={30} />
            <Typography fontSize={13}>
              {opt.firstName} {opt.lastName}
            </Typography>
          </Box>
        )}
        onChange={(_, user) =>
          navigate(
            AppRoutes.PrivateChat({
              userId: (user as User).id,
              returnUrl: location.pathname + location.search,
            })
          )
        }
        data={getUsersByFilterResult ?? []}
        inProgress={getUsersByFilterInProgress}
        onRequest={getUsersByFilter}
      />
      <IconButton onClick={() => setShowNewPrivateMessage(false)}>
        <Icon name='close' />
      </IconButton>
    </Stack>
  );
};
