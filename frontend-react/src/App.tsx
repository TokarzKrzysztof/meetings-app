import { ThemeProvider } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { theme } from 'src/config/theme-config';
import { useUserActivityWatcher } from 'src/hooks/useUserActivityWatcher';
import { ConfirmationDialogProvider } from 'src/providers/ConfirmationDialogProvider/ConfirmationDialogProvider';

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
