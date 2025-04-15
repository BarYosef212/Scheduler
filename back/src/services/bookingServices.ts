import { PrismaClient } from "@prisma/client";
import { Booking } from '../types/modelsTypes'
import { addTimeToAvailability, deleteTimeFromAvailability, getAvailabilityByDate } from "./availabilitiesServices";
import dayjs from "dayjs";
import { createEvent, deleteEvent } from './googleCalendar';
import { getUser } from "./userServices";
const prisma = new PrismaClient()


export const scheduleBooking = async (data: Booking): Promise<Booking | null> => {
  try {
    const { date, hour, userId, clientPhone } = data;

    const existingBooking = await prisma.booking.findFirst({
      where: {
        userId,
        clientPhone,
        date,
      },
    });

    if (existingBooking) return null;
    const availability = await getAvailabilityByDate(date, userId);
    if (!availability?.times.includes(hour)) {
      return null
    };

    const user = await getUser(userId);

    if (user?.googleTokens) {
      const event = await createEvent(userId, 'primary', data);
      if (!event) return null;
      data.googleEventId = event.id ?? '0';
    }

    const booking = await prisma.booking.create({ data });

    if (!booking) return null;

    const deleted = await deleteTimeFromAvailability(date, hour, userId);
    if (!deleted) {
      await prisma.booking.delete({ where: { id: booking.id } });
      return null;
    }

    return booking;

  } catch (error) {
    console.error("Failed to schedule booking:", error);
    throw error;
  }
};


export const cancelBooking = async (booking: Booking): Promise<boolean> => {
  try {
    const { id, date, hour, userId, googleEventId } = booking;
    const newDate = new Date(date);

    const added = await addTimeToAvailability(newDate, hour, userId);
    if (!added) return false;

    const deletedBooking = await prisma.booking.delete({
      where: { id },
    });

    if (!deletedBooking) {
      await deleteTimeFromAvailability(date, hour, userId);
      return false;
    }

    const user = await getUser(userId);
    if (user?.googleTokens && googleEventId) {
      await deleteEvent(userId, 'primary', googleEventId);
    }

    return true;

  } catch (error) {
    console.error("Failed to cancel booking:", { booking, error });
    throw error;
  }
};



export const getAllBookingsById = async (id: string): Promise<Booking[] | null> => {
  try {
    const bookings = await prisma.booking.findMany({ where: { userId: id } });

    return bookings.length > 0 ? bookings : null;

  } catch (error) {
    console.error(`Error fetching bookings for user ${id}:`, error);
    throw error;
  }
};

export const updateBooking = async (newBooking: Booking, oldBooking: Booking): Promise<boolean> => {
  try {
    newBooking.date = new Date(newBooking.date)
    oldBooking.date = new Date(oldBooking.date)
    if (!(dayjs(newBooking.date).isSame(oldBooking.date)) || newBooking.hour != oldBooking.hour) {
      const scheduled = await scheduleBooking(newBooking)
      if(scheduled){
        await cancelBooking(oldBooking)
      }
    }
    else {
      await prisma.booking.update({ where: { id: oldBooking.id }, data: { ...newBooking } })
    }

    return true
  } catch (error) {
    console.error("error with updateBooking controller")
    throw error
  }
}




