import { useEffect, useRef, useState } from 'react';
import CalendarComp from '../../Schedule/Calendar/CalendarComp';
import { ActionIcon, Button, NumberInput } from '@mantine/core';
import { TimeInput } from '@mantine/dates';
import { createAvailabilities, deleteAvailabilities } from '../../../services/services';
import { useValuesAdmin } from '../context/AdminContext';
import ToggleButton from '../../ToggleButton/ToggleButton';
import { useParams } from 'react-router-dom';

const LoadingBooking: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [interval, setInterval] = useState<number>(30);
  const refStart = useRef<HTMLInputElement>(null);
  const refEnd = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>('');
  const [isAdd, setIsAdd] = useState<boolean>(true);
  const { setStep } = useValuesAdmin();
  const {userId} = useParams()

  const pickerControl = (r: React.RefObject<HTMLInputElement | null>) => {
    return (
      <ActionIcon
        variant='subtle'
        color='gray'
        onClick={() => r.current?.showPicker()}
      >
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
        setError('');
        await createAvailabilities(interval, startTime, endTime, selectedDate,userId||"");
      }
    }
    else{
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
        await deleteAvailabilities(startTime, endTime, selectedDate,userId||"");
      }
    }
  };

  return (
    <>
      <button
        onClick={() => {
          setStep(1);
        }}
      >
        חזור
      </button>
      <h2>{isAdd?'טעינת תורים יומית':'ביטול תורים יומי'}</h2>
      <CalendarComp
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />

      <TimeInput
        withAsterisk
        label='שעת התחלה'
        ref={refStart}
        rightSection={pickerControl(refStart)}
      />

      <TimeInput
        withAsterisk
        label='שעת סיום'
        ref={refEnd}
        rightSection={pickerControl(refEnd)}
      />

      <NumberInput
        disabled={!isAdd}
        radius='md'
        label='אינטרוול זמן (בדקות)'
        withAsterisk
        value={interval}
        onChange={(value) => {
          setInterval(Number(value));
        }}
      />

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ToggleButton
        right={'הוספה'}
        left={'ביטול'}
        isRight={isAdd}
        setIsRight={setIsAdd}
      />

      <Button
        onClick={handleSubmit}
        variant='gradient'
        gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
      >
        {isAdd?'טען':'בטל'} תורים
      </Button>
    </>
  );
};

export default LoadingBooking;
