import { useValuesAdmin } from '../context/AdminContext';
import './AdminDashboard.css';

const AdminDashboard: React.FC = () => {
  const { setStep } = useValuesAdmin();

  return (
    <>
      <button className="back-button" onClick={() => setStep(-1)}>חזור</button>
      <div className="admin-main">
        <button
          className="admin-button"
          onClick={() => {
            setStep(2);
          }}
        >
          תורים מוזמנים
        </button>
        <button
          className="admin-button"
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

