import dayjs from 'dayjs';
import { Calendar } from '@mantine/dates';
import '@mantine/dates/styles.css';
import './CalendarComp.css';
// https://mantine.dev/dates/calendar/?t=props

interface CalendarCompProp {
  scheduledDates?: Date[];
  selectedDate: Date;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
}

const CalendarComp: React.FC<CalendarCompProp> = ({
  scheduledDates,
  selectedDate,
  setSelectedDate,
}) => {

  const handleSelectDate = (dateSelected: Date) => {
    if (!selectedDate || !dayjs(dateSelected).isSame(selectedDate, 'date')) {
      setSelectedDate(dateSelected);
    }
  };
  const excludeDates = (date: Date) => {
    return date.getDay() == 5 || date.getDay() == 6;
  };

  return (
    <Calendar
      excludeDate={excludeDates}
      getDayProps={(dateSelected) => {
        const formattedDate = dayjs(dateSelected).format('YYYY-MM-DD');
        return {
          selected: selectedDate
            ? dayjs(dateSelected).isSame(selectedDate, 'date')
            : false,
          onClick: () => handleSelectDate(dateSelected),
          className: scheduledDates
            ?.map((date) => dayjs(date).format('YYYY-MM-DD'))
            ?.includes(formattedDate)
            ? 'booked-date'
            : '',
        };
      }}
      firstDayOfWeek={0}
      weekendDays={[5, 6]}
      defaultDate={new Date()}
      minDate={new Date()}
    />
  );
};

export default CalendarComp;
