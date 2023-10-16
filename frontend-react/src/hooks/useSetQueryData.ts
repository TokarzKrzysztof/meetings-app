import { useQueryClient } from 'react-query';
import { User } from 'src/models/user';
import { getCurrentUserQueryKey } from 'src/queries/user-queries';

export const useSetQueryData = () => {
  const queryClient = useQueryClient();

  const setCurrentUser = (data: User | null) => {
    queryClient.setQueryData(getCurrentUserQueryKey, data);
  };

  return { setCurrentUser };
};
