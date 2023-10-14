import { FormHTMLAttributes, PropsWithChildren } from 'react';
import { Container } from 'src/ui-components';

export type AuthFormProps = PropsWithChildren<{
  onSubmit: FormHTMLAttributes<HTMLFormElement>['onSubmit'];
  onChange?: FormHTMLAttributes<HTMLFormElement>['onChange'];
}>;

export const AuthForm = ({ children, onSubmit, onChange }: AuthFormProps) => {
  return (
    <Container
      component='form'
      onSubmit={onSubmit}
      onChange={onChange}
      maxWidth='sm'
    >
      {children}
    </Container>
  );
};
