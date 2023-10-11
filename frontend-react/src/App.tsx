import { useAtom } from 'jotai';
import { Outlet } from 'react-router-dom';
import { useUserGetCurrentUser } from 'src/queries/user-queries';
import { currentUserAtom } from 'src/store/store';

function App() {
  const [_, setCurrentUser] = useAtom(currentUserAtom);
  useUserGetCurrentUser({
    onSuccess: (user) => setCurrentUser(user),
  });

  return <Outlet />;
}

export default App;
