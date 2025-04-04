import React from 'react';
import { Box, LoadingOverlay } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useParams } from 'react-router-dom';
import { scheduleBooking } from '../../../services/services';
import { Booking } from '../../../types/modelTypes';
import useValidateForm from '../../hooks/useValidateForm';
import useFormReducer from '../../hooks/useFormReducer';
import { useValuesSchedule } from '../context/ScheduleContext';
import styles from './ScheduleForm.module.css';

const ScheduleForm: React.FC = () => {
  const { state, dispatch } = useFormReducer();
  const { error } = useValidateForm(
    state.phoneNumber,
    state.fullName,
    state.email,
  );
  const [visible, { toggle }] = useDisclosure(false);
  const { selectedDate, selectedHour, nextStep, setErrorConfirmMessage } =
    useValuesSchedule();
  const { userId } = useParams();
  const dateStr = `${selectedDate.getDate()}/${
    selectedDate.getMonth() + 1
  }/${selectedDate.getFullYear()}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (error) return;

    const bookingData = {
      userId,
      date: selectedDate as Date,
      hour: selectedHour,
      clientName: state.fullName,
      clientEmail: state.email,
      clientPhone: state.phoneNumber,
    };

    toggle();

    try {
      if (userId) {
        await scheduleBooking(bookingData as Booking, userId).then(() =>
          nextStep(),
        );
      }
    } catch (error: any) {
      setErrorConfirmMessage(error.response.data.message);
      nextStep();
    }
  };

  return (
    <Box pos='relative' className={styles.container}>
      <LoadingOverlay
        visible={visible}
        loaderProps={{
          children: <span className={styles.loadingText}>אנא המתן...</span>,
        }}
      />

      <form className={styles.form}>
        <h2 className={styles.title}>קבע תור</h2>
        <p className={styles.subtitle}>
          תור בתאריך <strong>{dateStr}</strong> בשעה{' '}
          <strong>{selectedHour}</strong>
        </p>

        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor='fullName'>
            שם מלא
          </label>
          <input
            id='fullName'
            type='text'
            value={state.fullName}
            onChange={(e) =>
              dispatch({ type: 'SET_NAME', payload: e.target.value })
            }
            className={styles.input}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor='email'>
            אימייל
          </label>
          <input
            id='email'
            type='email'
            value={state.email}
            onChange={(e) =>
              dispatch({ type: 'SET_EMAIL', payload: e.target.value })
            }
            className={styles.input}
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor='phone'>
            מספר טלפון
          </label>
          <input
            id='phone'
            type='tel'
            value={state.phoneNumber}
            onChange={(e) =>
              dispatch({ type: 'SET_PHONE', payload: e.target.value })
            }
            className={styles.input}
            required
          />
          {error && <span className={styles.errorText}>{error}</span>}
        </div>

        <button
          type='submit'
          className={styles.submitBtn}
          onClick={handleSubmit}
          disabled={!!error ||!state.email||!state.fullName || !state.phoneNumber}
        >
          קבע תור
        </button>
      </form>
    </Box>
  );
};

export default ScheduleForm;
