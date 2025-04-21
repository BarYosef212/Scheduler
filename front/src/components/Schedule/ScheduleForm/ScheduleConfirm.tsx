import React from 'react';
import { useValuesSchedule } from '../context/ScheduleContext';
import styles from './ScheduleConfirm.module.css';

const ScheduleConfirm: React.FC = () => {
  const { selectedHour, selectedDate, errorConfirmMessage, nextStep } =
    useValuesSchedule();

  const dateStr = `${selectedDate.getDate()}/${
    selectedDate.getMonth() + 1
  }/${selectedDate.getFullYear()}`;
  console.log("Error: ",errorConfirmMessage)


  return (
    <div className={styles.container}>
      <div className={styles.confirmCard}>
        {errorConfirmMessage ? (
          <div className={styles.errorContainer}>
            <p className={styles.errorMessage}>{errorConfirmMessage}</p>
          </div>
        ) : (
          <div className={styles.successContainer}>
            <div className={styles.iconSuccess}>✓</div>
            <h2 className={styles.title}>התור הוזמן בהצלחה</h2>
            <p className={styles.details}>
              לתאריך <strong>{dateStr}</strong>
              <br />
              בשעה <strong>{selectedHour}</strong>
            </p>
          </div>
        )}

        <button className={styles.navigationBtn} onClick={nextStep}>
          חזור למסך הראשי
        </button>
      </div>
    </div>
  );
};

export default ScheduleConfirm;
