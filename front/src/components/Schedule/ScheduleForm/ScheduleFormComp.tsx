import React from 'react';
import './ScheduleForm.css';
import { scheduleBooking } from '../../../services/services';
import { Booking } from '../../../types/modelTypes';
import { useDisclosure } from '@mantine/hooks';
import { Box, LoadingOverlay } from '@mantine/core';
import useValidateForm from '../../hooks/useValidateForm';
import useFormReducer from '../../hooks/useFormReducer';
import { useValuesSchedule } from '../context/ScheduleContext';

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

  const dateStr = `${selectedDate.getDate()}/${
    selectedDate.getMonth() + 1
  }/${selectedDate.getFullYear()}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (error) return;
    let data = {
      userId: '1',
      date: selectedDate as Date,
      hour: selectedHour,
      clientName: state.fullName,
      clientEmail: state.email,
      clientPhone: state.phoneNumber,
    };
    toggle();
    try {
      await scheduleBooking(data as Booking).then(()=>nextStep())
    } catch (error: any) {
      setErrorConfirmMessage(error.response.data.message);
      nextStep();
    }
  };

  return (
    <>
      <Box pos='relative'>
        <LoadingOverlay
          visible={visible}
          loaderProps={{
            children: <span style={{ fontSize: '18px' }}>...אנא המתן</span>,
          }}
        />
        <form className='schedule-form'>
          <h2 className='form-title'>קבע תור</h2>
          <p className='form-subtitle'>
            תור בתאריך <b>{dateStr}</b> בשעה <b>{selectedHour}</b>
          </p>

          <div className='form-input-group'>
            <label className='form-label'>שם מלא</label>
            <input
              type='text'
              value={state.fullName}
              onChange={(e) =>
                dispatch({ type: 'SET_NAME', payload: e.target.value })
              }
              className='form-input name-form-input'
              required
            />
          </div>

          <div className='form-input-group'>
            <label className='form-label'>אימייל</label>
            <input
              type='email'
              value={state.email}
              onChange={(e) =>
                dispatch({ type: 'SET_EMAIL', payload: e.target.value })
              }
              className='form-input'
              placeholder='לא חובה'
            />
          </div>

          <div className='form-input-group'>
            <label className='form-label'>מספר טלפון</label>
            <input
              type='tel'
              value={state.phoneNumber}
              onChange={(e) =>
                dispatch({ type: 'SET_PHONE', payload: e.target.value })
              }
              className='form-input'
              required
            />

            {error && <span className='error-text'>{error}</span>}
          </div>

          <button
            disabled={!!error || !state.fullName || !state.phoneNumber}
            type='submit'
            className='submit-btn btn-navigation btn'
            onClick={handleSubmit}
          >
            שלח
          </button>
        </form>
      </Box>
    </>
  );
};

export default ScheduleForm;
