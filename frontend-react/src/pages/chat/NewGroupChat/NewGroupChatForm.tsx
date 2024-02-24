import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { FormField } from 'src/components/FormField';
import { useRouteState } from 'src/hooks/useRouteState';
import { User } from 'src/models/user';
import { NewGroupChatFormUsers } from 'src/pages/chat/NewGroupChat/NewGroupChatFormUsers';
import { NewGroupChatFormData } from 'src/pages/chat/NewGroupChat/new-group-chat-form-data';
import { Button, Container, Stack, Typography } from 'src/ui-components';
import { ValidationMessages } from 'src/utils/helpers/validation-messages';

export type NewGroupChatFormProps = {
  onSubmit: (data: NewGroupChatFormData) => void;
  inProgress: boolean;
};

export const NewGroupChatForm = ({ onSubmit, inProgress }: NewGroupChatFormProps) => {
  const defaultUser = useRouteState<User>();
  const inputRef = useRef<HTMLInputElement>(null);
  const form = useForm<NewGroupChatFormData>({
    defaultValues: {
      users: defaultUser ? [defaultUser] : undefined,
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <Container
      maxWidth='sm'
      component='form'
      onSubmit={handleSubmit(onSubmit, () => errors.users && inputRef.current!.focus())}
    >
      <Typography variant='h5' sx={{ my: 4 }} textAlign='center' fontWeight='bold'>
        Nowa rozmowa grupowa
      </Typography>
      <NewGroupChatFormUsers form={form} inputRef={inputRef} />
      <FormField
        sx={{ mt: 6 }}
        form={form}
        label='Nazwa grupy'
        {...register('name', {
          required: ValidationMessages.required,
        })}
      ></FormField>
      <Stack mt={4} justifyContent={'flex-end'}>
        <Button type='submit' disabled={inProgress}>
          Utwórz rozmowę grupową
        </Button>
      </Stack>
    </Container>
  );
};
