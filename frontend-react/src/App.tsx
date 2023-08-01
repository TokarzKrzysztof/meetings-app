import { Outlet, useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();
  return (
    <>
      <button onClick={() => navigate('login')}>login</button>
      <button onClick={() => navigate('register')}>register</button>
      <button onClick={() => navigate('/')}>home</button>
      <Outlet />
    </>
  );
}

export default App;
