import './ToggleButton.css';

interface props {
  right: string;
  left: string;
  isRight: boolean;
  setIsRight: (args: boolean) => void;
}

const ToggleButton: React.FC<props> = ({
  right,
  left,
  isRight,
  setIsRight,
}) => {
  const handleToggle = () => {
    setIsRight(!isRight);
  };

  return (
    <div className='toggle-container'>
      <div
        className={`toggle-wrapper ${
          isRight ? 'add-selected' : 'cancel-selected'
        }`}
      >
        <button
          className={`toggle-button ${!isRight ? 'active' : ''}`}
          onClick={handleToggle}
        >
          {left}
        </button>
        <button
          className={`toggle-button ${isRight ? 'active' : ''}`}
          onClick={handleToggle}
        >
          {right}
        </button>
      </div>
    </div>
  );
};

export default ToggleButton;
