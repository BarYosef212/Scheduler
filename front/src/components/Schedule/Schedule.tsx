import './Schedule.css';
import CalendarComp from './Calendar/CalendarComp';
import TimesList from './TimesList/TimesList';
import { useEffect, useState } from 'react';
import { getAvailabilities } from '../../services/services';
import { Availability } from '../../types/userTypes';

const Schedule: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [timesList, setTimesList] = useState<String[]>([]);
  const [allTimes, setAllTimes] = useState<Availability[]>([]);
  const [isLoadingTimesList, setIsLoadingTimesList] = useState<boolean>(true);

  useEffect(() => {
    getAvailabilities()
      .then((times) => {
        setAllTimes(times);
      })
      .then(() => setIsLoadingTimesList(false));
  }, []);

  return (
    <div className='Schedule-container'>
      <a href='/'>back</a> {/*erase*/}
      <div className='Schedule-calendar-container'>
        <CalendarComp
          setSelectedDate={setSelectedDate}
          selectedDate={selectedDate}
        />
      </div>
      <TimesList
        timesList={timesList}
        selectedDate={selectedDate}
        setTimesList={setTimesList}
        allTimes={allTimes}
        setSelectedDate={setSelectedDate}
        isLoadingTimesList={isLoadingTimesList}
      />
    </div>
  );
};

export default Schedule;
