import React from 'react';
import { useValuesAdmin } from '../context/AdminContext';
import styles from './AdminDashboard.module.css';

const AdminDashboard: React.FC = () => {
  const { setStep } = useValuesAdmin();
  
  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.dashboardHeader}>
        <h1 className={styles.dashboardTitle}>לוח ניהול</h1>
        <button className={styles.backButton} onClick={() => setStep(-1)}>
          &larr; חזור
        </button>
      </header>

      <div className={styles.adminGrid}>
        <div className={styles.adminCard} onClick={() => setStep(2)}>
          <h2 className={styles.cardTitle}>תורים מוזמנים</h2>
          <p className={styles.cardDescription}>
            צפייה וניהול תורים שנקבעו במערכת
          </p>
        </div>

        <div className={styles.adminCard} onClick={() => setStep(3)}>
          <h2 className={styles.cardTitle}>ניהול זמינויות</h2>
          <p className={styles.cardDescription}>
            הגדרת זמנים פנויים וחסומים במערכת
          </p>
        </div>

        <div className={styles.adminCard} onClick={() => setStep(4)}>
          <h2 className={styles.cardTitle}>הגדרות</h2>
          <p className={styles.cardDescription}>
            הגדרות מנהל עסק
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
