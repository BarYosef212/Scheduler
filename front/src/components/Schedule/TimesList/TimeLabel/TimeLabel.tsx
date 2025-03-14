import './TimeLabel.css';
import { useEffect, useState } from 'react';
interface TimeLabelProp {
  time: String;
  selectedDate: Date | null;
}

const TimeLabel: React.FC<TimeLabelProp> = ({ time, selectedDate }) => {
  const dividedTime = time.split("-")
  const hour = dividedTime[0];
  const minute = dividedTime[1];

  // function handleSelectedTime() {
  //   selectedDate?.setHours(time.getHours());
  //   selectedDate?.setMinutes(time.getMinutes());
  // }
  return (
    <>
      <button className={`TimeLabel-hour-label}`}>
        <span>{hour}</span>:<span>{minute}</span>
      </button>
    </>
  );
};

export default TimeLabel;
