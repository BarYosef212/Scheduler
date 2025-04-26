import { isAuthenticated, logout } from '../../services/services';
import { useState, useEffect } from 'react';
import { Loader } from '@mantine/core';
import styles from './styles.module.css';
import { useValuesGlobal } from '../GlobalContext/GlobalContext';

const Main: React.FC = () => {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const { userId, user } = useValuesGlobal();
  const [title, setTitle] = useState<string>('');
  const [headTitle, setHeadtitle] = useState<string>('');
  const [logo, setLogo] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authStatus = await isAuthenticated(userId);
        setIsAuth(authStatus);
        if (user) {
          setTitle(user.title || '');
          setHeadtitle(user.userName || '');
          if (user.logo) setLogo(user.logo);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      window.location.reload();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.pageLoaderContainer}>
        <Loader color='var(--gold)' size='md' />
      </div>
    );
  }

  return (
    <>
      {headTitle ? (
        <main className={styles.mainContainer}>
          <div className={styles.contentWrapper}>
            {logo && (
              <div className={styles.logoContainer}>
                <img src={logo} alt='Logo' className={styles.brandLogo} />
              </div>
            )}

            <h1 className={styles.pageTitle}>{headTitle}</h1>
            <h4 className={styles.pageSubtitle}>{title}</h4>

            <div className={styles.buttonContainer}>
              <a href={`/schedule/${userId}`} className={styles.actionButton}>
                קבע תור
              </a>

              {isAuth && (
                <>
                  <a
                    href={`/admin/${userId}`}
                    className={`${styles.actionButton} ${styles.actionButtonSecondary}`}
                  >
                    Admin
                  </a>

                  <button
                    onClick={handleLogout}
                    className={`${styles.actionButton} ${styles.actionButtonDanger}`}
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </main>
      ) : (
        <div className={styles.pageLoaderContainer}>
          <Loader color='var(--gold)' size='lg' />
        </div>
      )}
    </>
  );
};

export default Main;
