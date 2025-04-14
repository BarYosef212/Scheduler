import styles from './AppointmentLabel.module.css';
import { cancelBookingService } from '../../../../services/services';
import { Availability, Booking } from '../../../../types/modelTypes';
import {Modal } from '@mantine/core';
import ModalForm from './ModalForm/ModalForm';
import { useState } from 'react';
import { Loader } from '@mantine/core';
import { useValuesAdmin } from '../../context/AdminContext';
import { useToast } from '../../../hooks/useToast';

interface AppointmentLabelProps {
  booking: Booking;
  setAllBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
  allTimes: Availability[];
}

const AppointmentLabel: React.FC<AppointmentLabelProps> = ({
  booking,
  setAllBookings,
  allTimes,
}) => {
  const { hour, clientPhone, clientEmail, clientName, createdAt } = booking;
  const [opened, setOpened] = useState(false);
  const { isLoading, setIsLoading } = useValuesAdmin();
  const {showToast} = useToast()

  const createdDate = createdAt ? new Date(createdAt) : new Date();

  const formattedDate = new Intl.DateTimeFormat('he-IL', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(createdDate);

  const cancelBooking = async () => {
    try {
      const confirmation = confirm('האם אתה בטוח שברצונך לבטל את התור?');
      if (!confirmation) return;
      setIsLoading(true);
      const res = await cancelBookingService(booking);
      if (res) {
        setAllBookings((prev) => prev.filter((b) => b.id !== booking.id));
      }
      showToast('הפעולה בוצעה בהצלחה','success')
    } catch (error) {
      console.log(error);
      showToast('התרחשה שגיאה, אנא נסה בשנית', 'error');

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <div>
          <Loader size='md' color='var(--gold)' />
        </div>
      ) : (
        <div className={styles.appointmentCard}>
          <div className={styles.contentContainer}>
            <div className={styles.headerSection}>
              <h3 className={styles.clientName}>{clientName}</h3>
              <div className={styles.appointmentTime}>{hour}</div>
            </div>

            <div className={styles.detailsSection}>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>טלפון</span>
                <br />
                <span className={styles.detailValue}>{clientPhone}</span>
              </div>

              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>אימייל</span>
                <br />
                <span className={styles.detailValue}>
                  {clientEmail ? clientEmail : 'לא קיים'}
                </span>
              </div>

              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>נוצר בתאריך</span>
                <br />
                <span className={styles.detailValue}>{formattedDate}</span>
              </div>
            </div>
          </div>

          <div className={styles.actionButtons}>
            <button
              className={styles.cancelButton}
              onClick={cancelBooking}
              title='בטל תור'
            >
              ✕
            </button>

            <button
              className={styles.editButton}
              onClick={() => setOpened(true)}
              title='ערוך תור'
            >
              ✎
            </button>
          </div>

          <Modal
            opened={opened}
            onClose={() => setOpened(false)}
            styles={{
              inner: {
                position: 'fixed',
                top: '40%',
                left: '0',
                height: 'fit-content',
              },
              content: { padding: '24px' },
            }}
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
      )}
    </>
  );
};

export default AppointmentLabel;
