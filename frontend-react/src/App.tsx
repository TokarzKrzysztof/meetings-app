import { ThemeProvider, createTheme } from '@mui/material';
import { deepPurple } from '@mui/material/colors';
import { useSetAtom } from 'jotai';
import { Outlet } from 'react-router-dom';
import { ConfirmationDialogProvider } from 'src/providers/ConfirmationDialogProvider/ConfirmationDialogProvider';
import { useGetCurrentUser } from 'src/queries/user-queries';
import { currentUserAtom } from 'src/store/store';

const theme = createTheme({
  palette: {
    primary: deepPurple,
  },
});

function App() {
  const setCurrentUser = useSetAtom(currentUserAtom);
  useGetCurrentUser({
    onSuccess: (user) => setCurrentUser(user),
  });

  return (
    <ThemeProvider theme={theme}>
      <ConfirmationDialogProvider>
        <Outlet />
      </ConfirmationDialogProvider>
    </ThemeProvider>
  );
}

export default App;
