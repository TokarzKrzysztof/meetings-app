import { User } from 'src/models/user';
import { useGetCurrentUser } from 'src/queries/user-queries';

export const useLoggedInUser = () => {
  const { currentUser } = useGetCurrentUser();
  return currentUser as User;
};
