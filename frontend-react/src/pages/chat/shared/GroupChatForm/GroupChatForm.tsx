import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { FormField } from 'src/components/FormField';
import { useLoggedInUser } from 'src/hooks/useLoggedInUser';
import { Chat } from 'src/models/chat/chat';
import { GroupChatFormUsers } from 'src/pages/chat/shared/GroupChatForm/GroupChatFormUsers';
import { GroupChatFormData } from 'src/pages/chat/shared/GroupChatForm/group-chat-form-data';
import { Button, Container, Stack, Typography } from 'src/ui-components';
import { ValidationMessages } from 'src/utils/helpers/validation-messages';

export type GroupChatFormProps = {
  data?: Chat;
  disabledWhenUntouched?: boolean;
  onSubmit: (data: GroupChatFormData) => void;
  title: string;
  inProgress: boolean;
  buttonText: string;
};

export const GroupChatForm = ({
  data,
  disabledWhenUntouched,
  onSubmit,
  title,
  inProgress,
  buttonText,
}: GroupChatFormProps) => {
  const currentUser = useLoggedInUser();
  const inputRef = useRef<HTMLInputElement>(null);
  const form = useForm<GroupChatFormData>({
    defaultValues: data
      ? {
          name: data.name!,
          users: data.participants.filter(x => x.id !== currentUser.id),
        }
      : undefined,
  });
  const {
    register,
    handleSubmit,
    formState: { isDirty, errors },
  } = form;

  return (
    <Container
      maxWidth='sm'
      component='form'
      onSubmit={handleSubmit(onSubmit, () => errors.users && inputRef.current!.focus())}
    >
      <Typography variant='h5' sx={{ my: 4 }} textAlign='center' fontWeight='bold'>
        {title}
      </Typography>
      <GroupChatFormUsers form={form} inputRef={inputRef} />
      <FormField
        sx={{ mt: 6 }}
        form={form}
        label='Nazwa grupy'
        {...register('name', {
          required: ValidationMessages.required,
        })}
      ></FormField>
      <Stack mt={4} justifyContent={'flex-end'}>
        <Button type='submit' disabled={(disabledWhenUntouched && !isDirty) || inProgress}>
          {buttonText}
        </Button>
      </Stack>
    </Container>
  );
};
