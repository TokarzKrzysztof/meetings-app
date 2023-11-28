import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/pl';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { SnackbarProvider } from 'notistack';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClientProvider } from 'react-query';
import { RouterProvider } from 'react-router-dom';
import { SnackbarCloseButton } from 'src/components/SnackbarCloseButton';
import { queryClient } from 'src/config/query-config';
import './config/axios-config';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { router } from './router';

dayjs.extend(utc);
dayjs.extend(timezone);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='pl'>
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
          action={(snackbarKey) => <SnackbarCloseButton snackbarKey={snackbarKey} />}
          preventDuplicate
        >
          <RouterProvider router={router} />
        </SnackbarProvider>
      </LocalizationProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
