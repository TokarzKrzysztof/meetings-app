import { useNavigate } from 'react-router-dom';

export const useNavigateBack = () => {
  const navigate = useNavigate();
  return () => {
    navigate(-1);
  };
};
