import { useEffect, useState } from 'react';
import './AppointmentsList.css';
import { Availability, Booking } from '../../../types/modelTypes';
import * as services from '../../../services/services';
import CalendarComp from '../../Schedule/Calendar/CalendarComp';
import AppointmentLabel from './AppointmentLabel/AppointmentLabel';
import { Loader } from '@mantine/core';

interface AppointmentsListProps {
  setCurrentView: React.Dispatch<
    React.SetStateAction<'main' | 'appointments' | 'loadingAppointments'>
  >;
}

const AppointmentsList: React.FC<AppointmentsListProps> = ({
  setCurrentView,
}) => {
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [allTimes, setAllTimes] = useState<Availability[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [scheduledDates, setScheduledDates] = useState<Date[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    services.getAvailabilities().then((list) => setAllTimes(list));
  }, []);

  useEffect(() => {
    services
      .getBookings()
      .then((list) => setAllBookings(list))
      .then(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    setBookings(services.filterBookingsByDate(allBookings, selectedDate));
  }, [selectedDate, allBookings]);

  useEffect(() => {
    setScheduledDates(allBookings.map((booking) => booking.date));
  }, [allBookings]);

  return (
    <>
      <button onClick={() => setCurrentView('main')}>חזור</button>
      {isLoading ? (
        <Loader />
      ) : (
        <div className='appointments-container'>
          <div className='calendar-section'>
            <CalendarComp
              setSelectedDate={setSelectedDate}
              selectedDate={selectedDate}
              scheduledDates={scheduledDates}
            />
          </div>

          <div className='appointments-list-wrapper'>
            {bookings.length === 0 ? (
              <p className='no-appointments'>
                לא נמצאו תורים מוזמנים לתאריך זה
              </p>
            ) : (
              bookings.map((booking, index) => {
                return (
                  <div className='appointment-item' key={index}>
                    <AppointmentLabel
                      booking={booking}
                      setAllBookings={setAllBookings}
                      allTimes={allTimes}
                    />
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AppointmentsList;
