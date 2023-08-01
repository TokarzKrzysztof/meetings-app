import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';
import App from './App';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { AppRoutes } from './utils/enums/app-routes';

// const ProtectedRoute = ({ element }: { element: ReactNode }) => {
//   const [isLogged] = useState(false);
//   return <>{isLogged ? element : <Navigate to={'/login'} />}</>;
// };

const router = createBrowserRouter([
  {
    path: AppRoutes.Home,
    element: <App />,
    children: [
      {
        index: true,
        lazy: () => import('./pages/Home/Home'),
      },
      {
        path: AppRoutes.Login,
        lazy: () => import('./pages/Login/Login'),
      },
      {
        path: AppRoutes.Register,
        lazy: () => import('./pages/Register/Register'),
      },
    ],
  },
  { path: '*', element: <Navigate to={AppRoutes.Home} /> },
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
