import { useRef, useState } from 'react';
import CalendarComp from '../../../Schedule/Calendar/CalendarComp';
import { ActionIcon, Button, NumberInput } from '@mantine/core';
import { TimeInput } from '@mantine/dates';
import { IconClock } from '@tabler/icons-react';
import { createAvailabilities } from '../../../../services/services';

const LoadingBooking: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [interval, setInterval] = useState<number>(30);
  const refStart = useRef<HTMLInputElement>(null);
  const refEnd = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>('');

  const pickerControl = (r: React.RefObject<HTMLInputElement | null>) => {
    return (
      <ActionIcon
        variant='subtle'
        color='gray'
        onClick={() => r.current?.showPicker()}
      >
        <IconClock size={16} stroke={1.5} />
      </ActionIcon>
    );
  };

  const handleSubmit = async() => {
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
      await createAvailabilities(interval, startTime, endTime, selectedDate);
    }
  };

  return (
    <>
      <h2>טעינת תורים יומית</h2>
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
        radius='md'
        label='אינטרוול זמן (בדקות)'
        withAsterisk
        value={interval}
        onChange={(value) => {
          setInterval(Number(value));
        }}
      />

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <Button
        onClick={handleSubmit}
        variant='gradient'
        gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
      >
        טען תורים
      </Button>
    </>
  );
};

export default LoadingBooking;
