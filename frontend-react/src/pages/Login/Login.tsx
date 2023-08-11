import { AuthButton } from 'src/components/AuthButton/AuthButton';
import { AuthForm } from 'src/components/AuthForm/AuthForm';
import { AuthGoBackBtn } from 'src/components/AuthGoBackBtn/AuthGoBackBtn';
import { AuthIcon } from 'src/components/AuthIcon/AuthIcon';
import { FormField } from 'src/components/FormField/FormField';
import { Header } from 'src/components/Header/Header';

export async function loader() {
  return null;
}

export const Login = () => {
  return (
    <>
      <Header leftSlot={<AuthGoBackBtn />}/>
      <AuthForm>
        <AuthIcon></AuthIcon>
        <FormField label={'Email'}></FormField>
        <FormField label={'Hasło'}></FormField>
        <AuthButton>Zaloguj</AuthButton>
      </AuthForm>
    </>
  );
};

Login.displayName = 'Login';
