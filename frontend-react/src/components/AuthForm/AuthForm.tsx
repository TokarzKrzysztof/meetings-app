import { PropsWithChildren } from 'react';
import { Container } from 'src/ui-components';

export const AuthForm = ({ children }: PropsWithChildren<{}>) => {
  return <Container component='form'>{children}</Container>;
};
