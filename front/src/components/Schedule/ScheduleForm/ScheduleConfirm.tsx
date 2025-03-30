import { useValuesSchedule } from '../context/ScheduleContext';

const ScheduleConfirm: React.FC = () => {
  const { selectedHour, selectedDate } = useValuesSchedule();
  const dateStr = `${selectedDate.getDate()}/${
    selectedDate.getMonth() + 1
  }/${selectedDate.getFullYear()}`;

  const { errorConfirmMessage, nextStep } = useValuesSchedule();
  {
  }
  return (
    <>
      <button className='btn-navigation btn' onClick={nextStep}>חזור למסך הראשי</button>
      {errorConfirmMessage ? (
        <p style={{ color: 'red' }}>{errorConfirmMessage}</p>
      ) : (
        <>
          <p>
            תורך הוזמן בהצלחה לתאריך <b>{dateStr}</b>
            <br></br>
            בשעה <b>{selectedHour}</b>
          </p>
        </>
      )}
    </>
  );
};

export default ScheduleConfirm;
