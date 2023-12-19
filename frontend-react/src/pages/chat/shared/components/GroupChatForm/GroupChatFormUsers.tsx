import { RefObject } from 'react';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { UsersHttpAutocomplete } from 'src/components/UsersHttpAutocomplete';
import { GroupChatFormData } from 'src/pages/chat/shared/components/GroupChatForm/group-chat-form-data';
import {
  Avatar,
  Icon,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from 'src/ui-components';

export type GroupChatFormUsersProps = {
  form: UseFormReturn<GroupChatFormData, unknown, undefined>;
  inputRef: RefObject<HTMLInputElement>;
};

export const GroupChatFormUsers = ({ form, inputRef }: GroupChatFormUsersProps) => {
  const {
    control,
    formState: { errors },
  } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    keyName: 'key',
    name: 'users',
  });

  return (
    <>
      <UsersHttpAutocomplete
        onSelectUser={(user) => !fields.some((x) => x.id === user.id) && append(user)}
        inputRef={inputRef}
        error={errors.users?.root?.message}
      />
      <List>
        {fields.map((user, i) => {
          return (
            <ListItem
              key={user.key}
              disableGutters
              secondaryAction={
                <IconButton aria-label='comment' onClick={() => remove(i)}>
                  <Icon name='delete' />
                </IconButton>
              }
            >
              <ListItemAvatar>
                <Avatar src={user.profileImageSrc} size={30} />
              </ListItemAvatar>
              <ListItemText primary={`${user.firstName} ${user.lastName}`} />
            </ListItem>
          );
        })}
      </List>
    </>
  );
};
