import './TimeLabel.css';
import { useContext } from 'react';
interface TimeLabelProp {
  time: String;
  index: number;
  setSelectedHour: React.Dispatch<React.SetStateAction<string | null>>;
  selectedTimeIndex: number;
  setSelectedTimeIndex: React.Dispatch<React.SetStateAction<number>>;
}

const TimeLabel: React.FC<TimeLabelProp> = ({
  time,
  index,
  setSelectedHour,
  selectedTimeIndex,
  setSelectedTimeIndex,
}) => {
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
