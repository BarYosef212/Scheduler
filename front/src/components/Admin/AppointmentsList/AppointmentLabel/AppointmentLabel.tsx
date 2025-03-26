import './AppointmentLabel.css';
import { cancelBookingService } from '../../../../services/services';
import { Availability, Booking } from '../../../../types/modelTypes';
import { Modal } from '@mantine/core';
import ModalForm from './ModalForm/ModalForm';
import { useState } from 'react';

interface appointmentLabelProps {
  booking: Booking;
  setAllBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
  allTimes: Availability[];
}
const AppointmentLabel: React.FC<appointmentLabelProps> = ({
  booking,
  setAllBookings,
  allTimes,
}) => {
  const { hour, id, clientPhone, clientEmail, clientName,createdAt} = booking;
  const [opened, setOpened] = useState(false);

  const date = new Date(createdAt)

 const formattedDate = new Intl.DateTimeFormat('he-IL', {
   weekday: 'long', 
   day: '2-digit',
   month: 'long', 
   year: 'numeric',
   hour:'2-digit',
   minute:'2-digit'
 }).format(date);

  const cancelBooking = async () => {
    try {
      const confirmation = confirm('האם אתה בטוח שברצונך לבטל את התור?');
      if (!confirmation) return;
      await cancelBookingService(booking);
      setAllBookings((prev) => prev.filter((booking) => booking.id != id));
      alert('התור בוטל, הודעה נשלחה ללקוח');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='appointment-label'>
      <div className='appointment-info'>
        <p className='appointment-name'>
          {clientName} בשעה {hour}
        </p>
        <p className='appointment-contact'>
          <b>נייד:</b> <span className='contact-value'>{clientPhone}</span>
          <br />
          <b>אימייל: </b>
          <span className='contact-value'>
            {clientEmail ? clientEmail : 'לא קיים'}
          </span>
          <br />
          <b>הוזמן ב:</b> <span className='contact-value'>{formattedDate}</span>
        </p>
        <div className='appointment-actions'>
          <button className='cancel-booking' onClick={cancelBooking}>
            X
          </button>
          <button className='update-booking' onClick={() => setOpened(true)}>
            <span className='update-icon'>✎</span>
          </button>

          <Modal
            opened={opened}
            onClose={() => setOpened(false)}
            centered
            closeOnEscape
            closeOnClickOutside
          >
            <ModalForm
              isOpen={opened}
              onClose={() => setOpened(false)}
              currentBooking={booking}
              allTimes={allTimes}
            />
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default AppointmentLabel;
