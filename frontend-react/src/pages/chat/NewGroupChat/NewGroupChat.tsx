import { useAtomValue } from 'jotai';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { FormField } from 'src/components/FormField';
import { Header } from 'src/components/header/Header';
import { connectionAtom } from 'src/hooks/signalR/connectionAtom';
import { useNavigateBack } from 'src/hooks/useNavigateBack';
import { NewGroupChatUsers } from 'src/pages/chat/NewGroupChat/NewGroupChatUsers';
import { NewGroupChatFormData } from 'src/pages/chat/NewGroupChat/new-group-chat-form-data';
import { useCreateGroupChat } from 'src/queries/chat-queries';
import { Button, Container, Stack, Typography } from 'src/ui-components';
import { AppRoutes } from 'src/utils/enums/app-routes';
import { ValidationMessages } from 'src/utils/helpers/validation-messages';

export const NewGroupChat = () => {
  const connection = useAtomValue(connectionAtom);
  const inputRef = useRef<HTMLInputElement>(null);
  const form = useForm<NewGroupChatFormData>();
  const navigate = useNavigate();
  const navigateBack = useNavigateBack();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = form;

  const { createGroupChat, createGroupChatInProgress } = useCreateGroupChat();

  const onSubmit = (data: NewGroupChatFormData) => {
    createGroupChat(
      {
        name: data.name,
        userIds: data.users.map((x) => x.id),
        connectionId: connection.connectionId!,
      },
      {
        onSuccess: (chatId) => {
          navigate(AppRoutes.GroupChat({ chatId }));
        },
      }
    );
  };

  return (
    <>
      <Header />
      <Container
        maxWidth='sm'
        component='form'
        onSubmit={handleSubmit(onSubmit, () => errors.users && inputRef.current!.focus())}
      >
        <Typography variant='h5' sx={{ my: 4 }} textAlign='center' fontWeight='bold'>
          Nowa rozmowa grupowa
        </Typography>
        <NewGroupChatUsers form={form} inputRef={inputRef} />
        <FormField
          sx={{ mt: 6 }}
          form={form}
          label='Nazwa grupy'
          {...register('name', {
            required: ValidationMessages.required,
          })}
        ></FormField>
        <Stack mt={4} justifyContent={'space-between'}>
          <Button type='button' variant='outlined' onClick={navigateBack}>
            Anuluj
          </Button>
          <Button type='submit' disabled={createGroupChatInProgress}>
            Utwórz rozmowę grupową
          </Button>
        </Stack>
      </Container>
    </>
  );
};

NewGroupChat.displayName = 'NewGroupChat';
