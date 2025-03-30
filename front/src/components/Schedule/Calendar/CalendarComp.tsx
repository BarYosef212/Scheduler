import dayjs from 'dayjs';
import { Calendar } from '@mantine/dates';
import '@mantine/dates/styles.css';
import './CalendarComp.css';
import { useValuesSchedule } from '../context/ScheduleContext';
// https://mantine.dev/dates/calendar/?t=props

interface CalendarCompProp {
  scheduledDates?: Date[];
  minDate?: Date;
  selectedDate: Date;
  setSelectedDate: (args: Date) => void;
}

const CalendarComp: React.FC<CalendarCompProp> = ({
  scheduledDates = [],
  minDate = new Date(),
  selectedDate,
  setSelectedDate,
}) => {
  const { daysExcluded } = useValuesSchedule();

  const excludeDates = (date: Date) => {
    return daysExcluded?.includes(date.getDay()) || false;
  };

  const handleSelectDate = (dateSelected: Date) => {
    if (!selectedDate || !dayjs(dateSelected).isSame(selectedDate, 'date')) {
      setSelectedDate(dateSelected);
    }
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
      minDate={minDate && new Date()}
    />
  );
};

export default CalendarComp;
