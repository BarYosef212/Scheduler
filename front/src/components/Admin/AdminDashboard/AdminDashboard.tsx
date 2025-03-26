import { useState } from 'react';
import './AdminDashboard.css';
import AppointmentsList from '../AppointmentsList/AppointmentsList';
import LoadingBooking from './LoadingBookings/LoadingBookings';
const AdminDashboard: React.FC = () => {
  const [currentView, setCurrentView] = useState<
    'appointments' | 'loadingAppointments' | 'main'
  >('main');

  const renderView = () => {
    if (currentView == 'appointments')
      return <AppointmentsList setCurrentView={setCurrentView} />;
    else if (currentView == 'loadingAppointments') return <LoadingBooking/> ;
  };

  return (
    <div className='admin-main'>
      {currentView === 'main' && (
        <>
          <button
            onClick={() => {
              setCurrentView('appointments');
            }}
          >
            תורים מוזמנים
          </button>
          <button
            onClick={() => {
              setCurrentView('loadingAppointments');
            }}
          >
            טעינת תורים
          </button>
        </>
      )}
      {renderView()}
    </div>
  );
};

export default AdminDashboard;
