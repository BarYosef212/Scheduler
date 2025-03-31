import { useEffect, useState } from 'react';
import './AppointmentsList.css';
import { Booking } from '../../../types/modelTypes';
import * as services from '../../../services/services';
import CalendarComp from '../../Schedule/Calendar/CalendarComp';
import AppointmentLabel from './AppointmentLabel/AppointmentLabel';
import { Loader } from '@mantine/core';
import { useValuesAdmin } from '../context/AdminContext';
import { useParams } from 'react-router-dom';

const AppointmentsList = () => {
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [scheduledDates, setScheduledDates] = useState<Date[]>([]);
  const { isLoading, setIsLoading } = useValuesAdmin();
  const { setStep, setAllTimes, allTimes } = useValuesAdmin();
  const {userId} = useParams()

  useEffect(() => {
    services
      .getConfirmedBookingsById(userId||"")
      .then((list) => setAllBookings(list))
      .then(() => setIsLoading(false));

    services.getAvailabilities(userId || '').then((list) => setAllTimes(list));
  }, []);

  useEffect(() => {
    setBookings(services.filterBookingsByDate(allBookings, selectedDate));
  }, [selectedDate, allBookings]);

  useEffect(() => {
    setScheduledDates(allBookings.map((booking) => booking.date));
  }, [allBookings]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className='appointments-container'>
          <button className='back-button' onClick={() => setStep(1)}>
            חזור
          </button>

          <div className='calendar-section'>
            <CalendarComp
              scheduledDates={scheduledDates}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />
          </div>

          <div className='appointments-list-wrapper'>
            {bookings.length === 0 ? (
              <p className='no-appointments'>
                לא נמצאו תורים מוזמנים לתאריך זה
              </p>
            ) : (
              <div className='appointment-list'>
                {bookings.map((booking, index) => (
                  <div className='appointment-item' key={index}>
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
      )}
    </>
  );
};

export default AppointmentsList;
