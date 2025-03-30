import { useValuesSchedule } from './context/ScheduleContext';
import Main from '../Main/Main';
import Schedule from './Schedule';
import ScheduleConfirm from './ScheduleForm/ScheduleConfirm';
import ScheduleForm from './ScheduleForm/ScheduleFormComp';

const MultiForm: React.FC<{}> = () => {
  const { step, prevStep } = useValuesSchedule();

  const getStepForm = (step: number) => {
    switch (step) {
      case 1:
        return <Schedule />;
      case 2:
        return <ScheduleForm />;
      case 3:
        return <ScheduleConfirm />;
      default:
        return <Main />;
    }
  };

  return (
    <>
      {step > 0 && step < 3 && (
        <button className='btn-navigation btn' onClick={prevStep}>
          חזור
        </button>
      )}
      {getStepForm(step)}
    </>
  );
};

export default MultiForm;
