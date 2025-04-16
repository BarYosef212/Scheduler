import { useEffect, useState } from 'react';
import styles from './AppointmentsList.module.css';
import { Booking } from '../../../types/modelTypes';
import * as services from '../../../services/services';
import CalendarComp from '../../Schedule/Calendar/CalendarComp';
import AppointmentLabel from './AppointmentLabel/AppointmentLabel';
import { Loader } from '@mantine/core';
import { useValuesAdmin } from '../context/AdminContext';
import { useValuesGlobal } from '../../GlobalContext/GlobalContext';
import { authGoogle } from '../../../services/services';
import { googleIcon } from '../../../assets/icons';

const AppointmentsList = () => {
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [scheduledDates, setScheduledDates] = useState<Date[]>([]);
  const [isConnectedToGoogle, setIsConnectedToGoogle] =
    useState<boolean>(true);
  const { setStep, allTimes, isLoading, setIsLoading } = useValuesAdmin();
  const { userId } = useValuesGlobal();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const confirmedBookings = await services.getBookingsById(userId);
        setAllBookings(confirmedBookings);
        await services.getUser(userId).then(user=>{
          if(user && !user.googleTokens) setIsConnectedToGoogle(false);
        })
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false)
      }
    };
    fetchData();
  }, []);


  useEffect(() => {
    setBookings(services.filterBookingsByDate(allBookings, selectedDate));
  }, [selectedDate, allBookings]);

  useEffect(() => {
    setScheduledDates(allBookings.map((booking) => booking.date));
  }, [allBookings]);

  const formatHebrewDate = (date: Date) => {
    return date.toLocaleDateString('he-IL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <>
      {isLoading ? (
        <div>
          <Loader size='lg' color='var(--gold)' />
        </div>
      ) : (
        <div className={styles.container}>
          <div className={styles.headerBar}>
            {!isConnectedToGoogle && (
              <button
                onClick={() => authGoogle(userId)}
                className={styles.googleCalendarButton}
              >
                {googleIcon}
                סנכרן עם יומן גוגל
              </button>
            )}

            <div className={styles.titleArea}>
              <h1 className={styles.pageTitle}>לוח תורים</h1>

              <div className={styles.dateDisplay}>
                {formatHebrewDate(selectedDate)}
              </div>
            </div>
            <button className={styles.backButton} onClick={() => setStep(1)}>
              חזור לדף הראשי
            </button>
          </div>

          <div className={styles.mainContent}>
            <div className={styles.calendarWrapper}>
              <CalendarComp
                scheduledDates={scheduledDates}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
              />
            </div>

            <div className={styles.appointmentsWrapper}>
              <h2 className={styles.sectionSubtitle}>תורים</h2>
              {bookings.length === 0 ? (
                <div className={styles.emptyState}>
                  <div className={styles.emptyStateIcon}>🕒</div>
                  <p className={styles.emptyStateText}>
                    אין תורים מוזמנים לתאריך הנבחר
                  </p>
                </div>
              ) : (
                <div className={styles.bookingsList}>
                  {bookings.map((booking, index) => (
                    <div
                      className={`${styles.bookingItem} ${index % 2 === 0 ? styles.evenRow : styles.oddRow}`}
                      key={booking.id || index}
                    >
                      <AppointmentLabel
                        booking={booking}
                        setAllBookings={setAllBookings}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AppointmentsList;
