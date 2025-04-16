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
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='20'
                  height='20'
                  viewBox='0 0 48 48'
                >
                  <path
                    fill='#EA4335'
                    d='M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z'
                  />
                  <path
                    fill='#4285F4'
                    d='M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z'
                  />
                  <path
                    fill='#FBBC05'
                    d='M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z'
                  />
                  <path
                    fill='#34A853'
                    d='M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z'
                  />
                  <path fill='none' d='M0 0h48v48H0z' />
                </svg>
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
                        allTimes={allTimes}
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
