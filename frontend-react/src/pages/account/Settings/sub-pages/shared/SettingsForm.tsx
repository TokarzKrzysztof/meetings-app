import { FormHTMLAttributes, PropsWithChildren } from 'react';
import { Container } from 'src/ui-components';

export type SettingsFormProps = PropsWithChildren<{
  onSubmit: FormHTMLAttributes<HTMLFormElement>['onSubmit'];
  onChange?: FormHTMLAttributes<HTMLFormElement>['onChange'];
}>;

export const SettingsForm = ({ children, onSubmit, onChange }: SettingsFormProps) => {
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
