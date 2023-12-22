import { useForm } from 'react-hook-form';
import { FormField } from 'src/components/FormField';
import { Chat } from 'src/models/chat/chat';
import { useChangeGroupChatName } from 'src/queries/chat-queries';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Icon,
  IconButton,
} from 'src/ui-components';
import { ValidationMessages } from 'src/utils/helpers/validation-messages';

type FormData = {
  name: string;
};

export type GroupChatChangeNameProps = {
  onClose: () => void;
  onReload: () => void;
  groupChat: Chat;
};

export const GroupChatChangeName = ({ onClose, onReload, groupChat }: GroupChatChangeNameProps) => {
  const { changeGroupChatName } = useChangeGroupChatName();
  const form = useForm<FormData>({
    defaultValues: {
      name: groupChat.name!,
    },
  });
  const {
    register,
    handleSubmit,
    formState: { isDirty },
  } = form;

  const onSubmit = ({ name }: FormData) => {
    changeGroupChatName(
      { chatId: groupChat.id, name },
      {
        onSuccess: () => {
          onReload();
          onClose();
        },
      }
    );
  };

  return (
    <Dialog open>
      <Box textAlign='right'>
        <IconButton onClick={onClose}>
          <Icon name='close'></Icon>
        </IconButton>
      </Box>
      <Box component={'form'} onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <FormField
            form={form}
            label='Nowa nazwa'
            {...register('name', {
              required: ValidationMessages.required,
            })}
          ></FormField>
        </DialogContent>
        <DialogActions>
          <Button type='button' variant='text' onClick={onClose}>
            Anuluj
          </Button>
          <Button type='submit' disabled={!isDirty}>
            Zapisz
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};
