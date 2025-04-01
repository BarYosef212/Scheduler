import { useParams } from 'react-router-dom';
import { getUser, isAuthenticated, logout } from '../../services/services';
import './Main.css';
import { useState, useEffect } from 'react';
import { Loader } from '@mantine/core';

const Main: React.FC = () => {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const { userId } = useParams();
  const [title, setTitle] = useState<string>('');
  const [headTitle, setHeadtitle] = useState<string>('');
  const [logo, setLogo] = useState<string>('');

  useEffect(() => {
    isAuthenticated(userId || '').then(setIsAuth);
    getUser(userId || '').then((user) => {
      setTitle(user?.title || '');
      setHeadtitle(user?.userName || '');
      if (user?.logo) setLogo(user.logo);
    });
  }, []);

  const logOut = async () => {
    await logout();
    window.location.reload();
  };

  return (
    <>
      {headTitle ? (
        <main
          className='main-page'
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            alignItems: 'center',
          }}
        >
          {logo && (
            <img
              src={logo}
              alt='Logo'
              className='main-logo'
              style={{ width: '170px', marginBottom: '16px' }}
            />
          )}
          <h1 className='main-main-label'>{headTitle}</h1>
          <h4>{title}</h4>
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
        </main>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default Main;
