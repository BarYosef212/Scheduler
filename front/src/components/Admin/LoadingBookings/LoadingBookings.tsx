import { useEffect, useRef, useState } from 'react';
import CalendarComp from '../../Schedule/Calendar/CalendarComp';
import { ActionIcon, Button, NumberInput } from '@mantine/core';
import styles from './LoadingBookings.module.css';
import { TimeInput } from '@mantine/dates';
import {
  createAvailabilities,
  deleteAvailabilities,
} from '../../../services/services';
import { useValuesAdmin } from '../context/AdminContext';
import ToggleButton from '../../ToggleButton/ToggleButton';
import { useParams } from 'react-router-dom';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

const LoadingBooking: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [interval, setInterval] = useState<number>(30);
  const refStart = useRef<HTMLInputElement>(null);
  const refEnd = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>('');
  const [isAdd, setIsAdd] = useState<boolean>(true);
  const { setStep } = useValuesAdmin();
  const { userId } = useParams();

  const pickerControl = (r: React.RefObject<HTMLInputElement | null>) => {
    return (
      <ActionIcon
        variant='subtle'
        color='gray'
        onClick={() => r.current?.showPicker()}
        className={styles.pickerIcon}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='16'
          height='16'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <circle cx='12' cy='12' r='10' />
          <polyline points='12 6 12 12 16 14' />
        </svg>
      </ActionIcon>
    );
  };

  const handleSubmit = async () => {
    if (isAdd) {
      if (!refStart.current?.value || !refEnd.current?.value || !interval) {
        setError('נא למלא את כל השדות');
        return;
      }
      const startTime = new Date(`1970-01-01T${refStart.current.value}:00`);
      const endTime = new Date(`1970-01-01T${refEnd.current.value}:00`);
      const endTimeInterval = new Date(endTime);
      endTimeInterval.setMinutes(endTime.getMinutes() - interval);
      if (startTime > endTimeInterval) {
        setError('זמן התחלה גדול מזמן סיום');
        return;
      } else if (interval <= 0 || interval > 1200) {
        setError('אינטרוול זמן לא תקין, מקבל ערכים בין 1 - 1200');
      } else {
        try {
           setError('');
           const response = await createAvailabilities(
             interval,
             startTime,
             endTime,
             selectedDate,
             userId || '',
           );

           console.log(response)
           Toastify({
             text: response,
             duration: 3000,
            style: {
              background: 'linear-gradient(to right, #00b09b, #96c93d)',
            },
            
           }).showToast();
           
        } catch (error:any) {
          console.log(error)
             Toastify({
             text: error || 'An error occurred',
             className: 'error',
             style: {
               background: 'linear-gradient(to right, #ff0000, #ff5f6d)',
             },
             }).showToast();
        }
       
      }
    } else {
      if (!refStart.current?.value || !refEnd.current?.value) {
        setError('נא למלא את כל השדות');
        return;
      }
      const startTime = new Date(`1970-01-01T${refStart.current.value}:00`);
      const endTime = new Date(`1970-01-01T${refEnd.current.value}:00`);
      if (startTime > endTime) {
        setError('זמן התחלה גדול מזמן סיום');
        return;
      } else {
        setError('');
        await deleteAvailabilities(
          startTime,
          endTime,
          selectedDate,
          userId || '',
        );
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button
          className={styles.backButton}
          onClick={() => {
            setStep(1);
          }}
        >
          חזור
        </button>
        <h2 className={styles.title}>
          {isAdd ? 'טעינת תורים יומית' : 'ביטול תורים יומי'}
        </h2>
      </div>

      <div className={styles.content}>
        <div className={styles.calendarSection}>
          <div className={styles.calendarWrapper}>
            <CalendarComp
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />
          </div>
        </div>

        <div className={styles.formSection}>
          <div className={styles.formGroup}>
            <TimeInput
              withAsterisk
              label='שעת התחלה'
              ref={refStart}
              rightSection={pickerControl(refStart)}
              className={styles.timeInput}
              classNames={{
                label: styles.inputLabel,
                input: styles.input,
              }}
            />
          </div>

          <div className={styles.formGroup}>
            <TimeInput
              withAsterisk
              label='שעת סיום'
              ref={refEnd}
              rightSection={pickerControl(refEnd)}
              className={styles.timeInput}
              classNames={{
                label: styles.inputLabel,
                input: styles.input,
              }}
            />
          </div>

          <div className={styles.formGroup}>
            <NumberInput
              disabled={!isAdd}
              radius='md'
              label='אינטרוול זמן (בדקות)'
              withAsterisk
              value={interval}
              onChange={(value) => {
                setInterval(Number(value));
              }}
              className={styles.numberInput}
              classNames={{
                label: styles.inputLabel,
                input: styles.input,
              }}
            />
          </div>

          {error && <p className={styles.errorMessage}>{error}</p>}

          <div className={styles.toggleContainer}>
            <ToggleButton
              right={'הוספה'}
              left={'ביטול'}
              isRight={isAdd}
              setIsRight={setIsAdd}
            />
          </div>

          <Button
            onClick={handleSubmit}
            variant='gradient'
            gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
            className={styles.submitButton}
          >
            {isAdd ? 'טען' : 'בטל'} תורים
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoadingBooking;
