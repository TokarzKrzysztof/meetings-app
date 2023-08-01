import { useEffect } from 'react';

function Comp({ aaa }: { aaa: string }) {
  return <div>{aaa}</div>;
}

function App() {
  const aaa = () => {};
  useEffect(() => {}, [aaa]);
  return (
    <>
      <Comp aaa={'asdsaddas'}></Comp>
      <Comp aaa={'asdsaddas'}></Comp>
      <button content={''}></button>
    </>
  );
}

export default App;
