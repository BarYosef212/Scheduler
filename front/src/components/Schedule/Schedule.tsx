import './Schedule.css';
import CalendarComp from './Calendar/CalendarComp';
import TimesList from './TimesList/TimesList';
import { useValuesSchedule } from './context/ScheduleContext';

const Schedule: React.FC = () => {
  const {
    selectedDate,
    setSelectedDate,
    selectedHour,
    nextStep,
  } = useValuesSchedule();

  return (
    <>
      <div className='Schedule-container'>
        <CalendarComp
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
        <TimesList />
        <button
          disabled={!(selectedDate && selectedHour)}
          className='Schedule-button btn'
          onClick={nextStep}
        >
          הבא
        </button>
      </div>
    </>
  );
};

export default Schedule;
