import { useParams } from 'react-router-dom';
import { isAuthenticated, logout } from '../../services/services';
import { useValuesGlobal } from '../GlobalContext/GlobalContext';
import './Main.css';
import { useState, useEffect } from 'react';

const Main: React.FC = () => {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const { userId } = useParams();

  useEffect(() => {
    isAuthenticated(userId || '').then(setIsAuth);
  }, []);

  const logOut = async () => {
    await logout();
  };

  return (
    <main
      className='main-page'
      style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
    >
      <h1 className='main-main-label'>ARIEL HAIR STYLE</h1>
      <h4>ספר גברים, ניתן לקבוע תור כעת</h4>
      <a href={`/Schedule/${userId}`} className='btn main-main-btn'>
        קבע תור
      </a>
      {isAuth && (
        <>
          <a href={`/admin/${userId}`} className='btn main-main-btn'>
            Admin
          </a>

          <button onClick={logOut}>logout</button>
        </>
      )}

      {/* <a href='/Login' className='btn main-main-btn'>
        Login
      </a> */}
    </main>
  );
};

export default Main;
