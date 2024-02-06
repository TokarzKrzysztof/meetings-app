import { FormHTMLAttributes, PropsWithChildren } from 'react';
import { Container } from 'src/ui-components';

export type MyProfileFormProps = PropsWithChildren<{
  onSubmit: FormHTMLAttributes<HTMLFormElement>['onSubmit'];
  onChange?: FormHTMLAttributes<HTMLFormElement>['onChange'];
}>;

export const MyProfileForm = ({ children, onSubmit, onChange }: MyProfileFormProps) => {
  return (
    <Container
      component='form'
      sx={{ pb: 2 }}
      onSubmit={onSubmit}
      onChange={onChange}
      maxWidth='sm'
    >
      {children}
    </Container>
  );
};
