import { useValuesAdmin } from '../context/AdminContext';
import './AdminDashboard.css';

const AdminDashboard: React.FC = () => {
  const { setStep } = useValuesAdmin();

  return (
    <>
      <button onClick={() => setStep(-1)}>חזור</button>
      <div className='admin-main'>
        <button
          onClick={() => {
            setStep(2);
          }}
        >
          תורים מוזמנים
        </button>
        <button
          onClick={() => {
            setStep(3);
          }}
        >
           ניהול זמינויות
        </button>
      </div>
    </>
  );
};

export default AdminDashboard;
