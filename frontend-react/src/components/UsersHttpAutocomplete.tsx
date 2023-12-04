import { RefObject } from 'react';
import { HttpAutocomplete } from 'src/components/HttpAutocomplete';
import { User } from 'src/models/user';
import { useGetUsersByFilter } from 'src/queries/user-queries';
import { Avatar, Box, Icon, TextField, Typography } from 'src/ui-components';

export type UsersHttpAutocompleteProps = {
  onSelectUser: (user: User) => void;
  inputRef?: RefObject<HTMLInputElement>;
  error?: string;
};

export const UsersHttpAutocomplete = ({
  onSelectUser,
  inputRef,
  error,
}: UsersHttpAutocompleteProps) => {
  const { getUsersByFilter, getUsersByFilterResult, getUsersByFilterInProgress } =
    useGetUsersByFilter();

  return (
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
          error={!!error}
          helperText={error}
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
      onChange={(_, user) => onSelectUser(user as User)}
      data={getUsersByFilterResult ?? []}
      inProgress={getUsersByFilterInProgress}
      onRequest={getUsersByFilter}
    />
  );
};
