import AdminDashboard from './AdminDashboard/AdminDashboard';
import LoadingBooking from './LoadingBookings/LoadingBookings';
import AppointmentsList from './AppointmentsList/AppointmentsList';
import { useValuesAdmin } from './context/AdminContext';
import Main from '../Main/Main';
import Preferences from './Preferences/Preferences';
const AdminControl: React.FC = () => {
  const { step } = useValuesAdmin();

  const getStepControl = (step: number) => {
    switch (step) {
      case 1:
        return <AdminDashboard />;
      case 2:
        return <AppointmentsList />;
      case 3:
        return <LoadingBooking />;
      case 4:
        return <Preferences/>
      default:
        return <Main />;
    }
  };

  return <>{getStepControl(step)}</>;
};

export default AdminControl;
