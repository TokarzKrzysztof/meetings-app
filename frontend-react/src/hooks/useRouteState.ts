import { useLocation } from 'react-router-dom';

export const useRouteState = <T>() => {
  const location = useLocation();
  return location.state as T | null;
};
