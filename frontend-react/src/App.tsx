import { ThemeProvider, createTheme } from '@mui/material';
import { deepPurple } from '@mui/material/colors';
import { Outlet } from 'react-router-dom';
import { useUserActivityWatcher } from 'src/hooks/useUserActivityWatcher';
import { ConfirmationDialogProvider } from 'src/providers/ConfirmationDialogProvider/ConfirmationDialogProvider';

const theme = createTheme({
  palette: {
    primary: deepPurple,
  },
});

function App() {
  useUserActivityWatcher();
  
  return (
    <ThemeProvider theme={theme}>
      <ConfirmationDialogProvider>
        <Outlet />
      </ConfirmationDialogProvider>
    </ThemeProvider>
  );
}

export default App;
