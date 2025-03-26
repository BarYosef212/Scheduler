import './Schedule.css';
import CalendarComp from './Calendar/CalendarComp';
import TimesList from './TimesList/TimesList';
import { useEffect, useState } from 'react';
import ScheduleForm from './ScheduleForm/ScheduleForm';
import { Availability } from '../../types/modelTypes';
import { getAvailabilities } from '../../services/services';

const Schedule: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [allAvailabilities, setAllAvailabilities] = useState<Availability[]>(
    [],
  );
  const [isLoadingTimesList, setIsLoadingTimesList] = useState<boolean>(true);
  const [selectedHour, setSelectedHour] = useState<string | null>(null);
  const [isCalendarVisible, setIsCalendarVisible] = useState<boolean>(true);
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);

  useEffect(() => {
    getAvailabilities()
      .then((times) => {
        setAllAvailabilities(times);
      })
      .then(() => setIsLoadingTimesList(false));
  }, []);

  useEffect(() => {
    setSelectedDate(new Date());
  }, [allAvailabilities]);

  return (
    <>
      {isCalendarVisible && (
        <div className='Schedule-container'>
          <a href='/'>קודם</a>
          <CalendarComp
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
          <TimesList
            isLoadingTimesList={isLoadingTimesList}
            setSelectedHour={setSelectedHour}
            allAvailabilities={allAvailabilities}
            selectedDate={selectedDate}
          />
          <button
            disabled={!(selectedDate && selectedHour)}
            className='Schedule-button btn'
            onClick={() => {
              setIsCalendarVisible(false);
              setIsFormVisible(true);
            }}
          >
            הבא
          </button>
        </div>
      )}
      {isFormVisible && (
        <>
          <button
            onClick={() => {
              window.location.reload();
            }}
          >
            חזור
          </button>
          <ScheduleForm
            setIsFormVisible={setIsFormVisible}
            isFormVisible={isFormVisible}
            selectedDate={selectedDate}
            selectedHour={selectedHour}
          />
        </>
      )}
    </>
  );
};

export default Schedule;
