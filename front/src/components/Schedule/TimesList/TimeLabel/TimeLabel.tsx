import { useValuesSchedule } from '../../context/ScheduleContext';
import './TimeLabel.css';
interface TimeLabelProp {
  time: String;
  index: number;
  selectedTimeIndex: number;
  setSelectedTimeIndex: React.Dispatch<React.SetStateAction<number>>;
}

const TimeLabel: React.FC<TimeLabelProp> = ({
  time,
  index,
  selectedTimeIndex,
  setSelectedTimeIndex,
}) => {
  const {setSelectedHour} = useValuesSchedule()
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
