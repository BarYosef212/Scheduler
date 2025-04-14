import dayjs from 'dayjs';
import { Calendar } from '@mantine/dates';
import '@mantine/dates/styles.css';
import styles from './CalendarComp.module.css';
import { useEffect, useState } from 'react';
import { useValuesGlobal } from '../../GlobalContext/GlobalContext';

interface CalendarCompProp {
  scheduledDates?: Date[];
  minDate?: Date;
  selectedDate: Date;
  setSelectedDate: (args: Date) => void;
}

const CalendarComp: React.FC<CalendarCompProp> = ({
  scheduledDates = [],
  minDate,
  selectedDate,
  setSelectedDate,
}) => {
  const [daysExcluded, setDaysExcluded] = useState<number[]>([]);
  const { user } = useValuesGlobal();

  useEffect(() => {
    try {
      if (user) setDaysExcluded(user?.daysExcluded || []);
    } catch (error) {
      console.log(error);
    }
  }, [user]);

  const excludeDates = (date: Date) => {
    return daysExcluded?.includes(date.getDay()) || false;
  };

  const handleSelectDate = (dateSelected: Date) => {
    if (!selectedDate || !dayjs(dateSelected).isSame(selectedDate, 'date')) {
      setSelectedDate(dateSelected);
    }
  };

  return (
    <>
      <div className={styles.calendarWrapper}>
        <Calendar
          styles={{levelsGroup:{justifyContent:"center"}}}
          className={styles.calendar}
          getDayProps={(dateSelected) => {
            const formattedDate = dayjs(dateSelected).format('YYYY-MM-DD');
            const isBooked = scheduledDates
              ?.map((date) => dayjs(date).format('YYYY-MM-DD'))
              ?.includes(formattedDate);

            return {
              selected: selectedDate
                ? dayjs(dateSelected).isSame(selectedDate, 'date')
                : false,
              onClick: () => handleSelectDate(dateSelected),
              className: isBooked ? styles.bookedDate : '',
            };
          }}
          excludeDate={excludeDates}
          firstDayOfWeek={0}
          weekendDays={[5, 6]}
          defaultDate={new Date()}
          minDate={minDate}
        />
      </div>
    </>
  );
};

export default CalendarComp;
