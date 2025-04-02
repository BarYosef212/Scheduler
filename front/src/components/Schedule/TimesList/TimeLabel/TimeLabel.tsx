import { useValuesSchedule } from '../../context/ScheduleContext';
import styles from './TimeLabel.module.css';

interface TimeLabelProp {
  time: String;
  index: number;
}

const TimeLabel: React.FC<TimeLabelProp> = ({ time, index }) => {
  const { setSelectedHour, setSelectedTimeIndex, selectedTimeIndex } =
    useValuesSchedule();
  const dividedTime = time.split('-');
  const hour = dividedTime[0];
  const minute = dividedTime[1];

  return (
    <button
      className={`${styles.timeLabel} ${
        selectedTimeIndex === index ? styles.selected : ''
      }`}
      onClick={() => {
        setSelectedTimeIndex(index);
        setSelectedHour(`${hour}-${minute}`);
      }}
    >
      <span className={styles.hour}>{hour}</span>
      <span className={styles.separator}>-</span>
      <span className={styles.minute}>{minute}</span>
    </button>
  );
};

export default TimeLabel;
