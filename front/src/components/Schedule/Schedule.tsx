import React from 'react';
import styles from './Schedule.module.css';
import CalendarComp from './Calendar/CalendarComp';
import TimesList from './TimesList/TimesList';
import { useValuesSchedule } from './context/ScheduleContext';

const Schedule: React.FC = () => {
  const { selectedDate, setSelectedDate, selectedHour, nextStep } =
    useValuesSchedule();

  return (
    <div className={styles.scheduleWrapper}>
      <div className={styles.scheduleContainer}>
        <h2 className={styles.scheduleTitle}>בחר תאריך ושעה</h2>

        <div className={styles.scheduleContent}>
          <div className={styles.calendarWrap}>
            <CalendarComp
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              minDate={new Date()}
            />
          </div>
          <TimesList />
        </div>

        <button
          disabled={!(selectedDate && selectedHour)}
          className={`btn ${styles.scheduleButton} ${!(selectedDate && selectedHour) ? styles.scheduleButtonDisabled : ''}`}
          onClick={nextStep}
        >
          הבא
        </button>
      </div>
    </div>
  );
};

export default Schedule;
