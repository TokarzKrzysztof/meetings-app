import { ThemeProvider, createTheme } from '@mui/material';
import { deepPurple } from '@mui/material/colors';
import { Outlet } from 'react-router-dom';
import { ConfirmationDialogProvider } from 'src/providers/ConfirmationDialogProvider/ConfirmationDialogProvider';

const theme = createTheme({
  palette: {
    primary: deepPurple,
  },
});

function App() {
  // const {currentUser} = useGetCurrentUser();
  // console.log(currentUser)
  return (
    <ThemeProvider theme={theme}>
      <ConfirmationDialogProvider>
        <Outlet />
      </ConfirmationDialogProvider>
    </ThemeProvider>
  );
}

export default App;
