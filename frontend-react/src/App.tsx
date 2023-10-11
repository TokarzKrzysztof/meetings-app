import { ThemeProvider, createTheme } from '@mui/material';
import { deepPurple } from '@mui/material/colors';
import { useAtom } from 'jotai';
import { Outlet } from 'react-router-dom';
import { useUserGetCurrentUser } from 'src/queries/user-queries';
import { currentUserAtom } from 'src/store/store';

const theme = createTheme({
  palette: {
    primary: deepPurple,
  },
});

function App() {
  const [_, setCurrentUser] = useAtom(currentUserAtom);
  useUserGetCurrentUser({
    onSuccess: (user) => setCurrentUser(user),
  });

  return (
    <ThemeProvider theme={theme}>
      <Outlet />
    </ThemeProvider>
  );
}

export default App;
