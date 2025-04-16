import { PrismaClient } from "@prisma/client";
import { Booking } from '../types/modelsTypes'
import * as AvailabilitiesServices from "./availabilitiesServices";
import dayjs from "dayjs";
import * as GoogleService from './googleCalendar';
import { getUser } from "./userServices";
import logger from "../config/logger";
const prisma = new PrismaClient()


export const scheduleBooking = async (data: Booking): Promise<Booking> => {
  try {
    const { date, hour, userId, clientPhone, clientEmail } = data;

    if (!date || !hour || !userId || !clientPhone || !clientEmail) {
      throw new Error("Missing required booking fields");
    }
    if (!dayjs(date).isValid()) {
      throw new Error("Invalid date format");
    }
    const bookingDate = new Date(date);

    const existingBooking = await prisma.booking.findFirst({
      where: {
        userId,
        OR: [
          { clientPhone },
          { clientEmail },
        ],
        date: bookingDate,
      },
    });
    if (existingBooking) {
      throw new Error("Booking already exists");
    }

    const availability = await AvailabilitiesServices.getAvailabilityByDate(date, userId);
    if (!availability || !availability.times.includes(hour)) {
      throw new Error("Requested time slot unavailable");
    }

    const user = await getUser(userId);
    if (!user) {
      throw new Error("User not found");
    }

    return await prisma.$transaction(async (tx) => {
      let googleEventId: string | undefined;

      if (user.googleTokens) {
        const event = await GoogleService.createEvent(userId, "primary", data);
        if (!event?.id) {
          throw new Error("Failed to create Google Calendar event");
        }
        googleEventId = event.id;
      }

      const booking = await tx.booking.create({
        data: { ...data, date: bookingDate, googleEventId },
      });

      const updated = await AvailabilitiesServices.deleteTimeFromAvailability(date, hour, userId, tx);
      if (!updated) {
        throw new Error("Failed to update availability");
      }

      return booking;
    });
  } catch (error: any) {
    throw new Error(`Failed to schedule booking: ${error.message}`);
  }
};

export const cancelBooking = async (booking: Booking): Promise<void> => {
  try {
    const { id, date, hour, userId, googleEventId } = booking;

    if (!id || !userId) {
      throw new Error("Booking ID and user ID are required");
    }
    const bookingDate = new Date(date);

    return await prisma.$transaction(async (tx) => {
      await AvailabilitiesServices.addTimeToAvailability(bookingDate, hour, userId, tx);
      await tx.booking.delete({ where: { id } });
      const user = await getUser(userId);
      if (user?.googleTokens && googleEventId) {
        await GoogleService.deleteEvent(userId, "primary", googleEventId);
      }
    });
  } catch (error: any) {
    throw new Error(`Failed to cancel booking: ${error.message}`);
  }
};

export const getAllBookingsById = async (id: string): Promise<Booking[]> => {
  try {
    const bookings = await prisma.booking.findMany({ where: { userId: id } });
    return bookings

  } catch (error) {
    logger.error(`Error fetching bookings for user ${id}:`, error);
    throw error;
  }
};

export const updateBooking = async (newBooking: Booking, oldBooking: Booking): Promise<boolean> => {
  try {
    newBooking.date = new Date(newBooking.date)
    oldBooking.date = new Date(oldBooking.date)
    if (!(dayjs(newBooking.date).isSame(oldBooking.date)) || newBooking.hour != oldBooking.hour) {
      const scheduled = await scheduleBooking(newBooking)
      if (scheduled) {
        await cancelBooking(oldBooking)
      }
    }
    else {
      await prisma.booking.update({ where: { id: oldBooking.id }, data: { ...newBooking } })
    }

    return true
  } catch (error) {
    logger.error("error with updateBooking controller")
    throw error
  }
}




