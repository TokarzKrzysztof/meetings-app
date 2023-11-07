import { useQueryClient } from 'react-query';
import { User } from 'src/models/user';
import { getCurrentUserQueryKey } from 'src/queries/user-queries';

export const useLoggedInUser = () => {
  const queryClient = useQueryClient();
  return queryClient.getQueryData(getCurrentUserQueryKey) as User;
};
