import { useValuesSchedule } from '../../context/ScheduleContext';
import './TimeLabel.css';
interface TimeLabelProp {
  time: String;
  index: number;
}

const TimeLabel: React.FC<TimeLabelProp> = ({
  time,
  index,
}) => {
  const {setSelectedHour,setSelectedTimeIndex,selectedTimeIndex} = useValuesSchedule()
  const dividedTime = time.split('-');
  const hour = dividedTime[0];
  const minute = dividedTime[1];
  return (
    <>
      <button
        className={`TimeLabel-hour-label} ${
          selectedTimeIndex == index ? `selected` : ``
        }`}
        onClick={() => {
          setSelectedTimeIndex(index);
          setSelectedHour(`${hour}-${minute}`);
        }}
      >
        <span>{hour}</span>-<span>{minute}</span>
      </button>
    </>
  );
};

export default TimeLabel;
