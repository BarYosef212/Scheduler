import dayjs from 'dayjs';
import { Calendar } from '@mantine/dates';
import '@mantine/dates/styles.css';
// https://mantine.dev/dates/calendar/?t=props

interface CalendarCompProp {
  setSelectedDate: React.Dispatch<React.SetStateAction<Date | null>>
  selectedDate:Date | null
}

const CalendarComp: React.FC<CalendarCompProp> = ({ setSelectedDate,selectedDate }) => {
  const handleSelect = (dateSelected: Date) => {
    if (selectedDate && dayjs(dateSelected).isSame(selectedDate, 'date')) {
      setSelectedDate(null);
    } else {
      setSelectedDate(dateSelected)
    }
  };
  
  return (
    <Calendar
      getDayProps={(dateSelected) => ({
        selected: selectedDate
          ? dayjs(dateSelected).isSame(selectedDate, 'date')
          : false,
        onClick: () => handleSelect(dateSelected),
      })}
      firstDayOfWeek={0}
      weekendDays={[5, 6]}
      defaultDate={new Date()}
      minDate={new Date()}
    />
  );
};

export default CalendarComp;
