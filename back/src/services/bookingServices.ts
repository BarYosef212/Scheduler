import { PrismaClient } from "@prisma/client";
import { Booking } from '../types/modelsTypes'
import * as AvailabilitiesServices from "./availabilitiesServices";
import dayjs from "dayjs";
import * as GoogleService from './googleCalendar';
import { getUser } from "./userServices";
import logger from "../config/logger";
import { AVAILABILITY_MESSAGES, BOOKING_MESSAGES, GENERAL_MESSAGES, USER_MESSAGE } from "../constants/messages";
import { AppError } from "../utils/errorHandler";
const prisma = new PrismaClient()


export const scheduleBooking = async (data: Booking): Promise<Booking> => {
  let googleEventId: string | undefined;
  let createdBookingId: string | undefined;
  const { date, hour, userId, clientPhone, clientEmail } = data;
  const bookingDate = new Date(date);

  try {
    if (!date || !hour || !userId || !clientPhone || !clientEmail) {
      throw new Error(GENERAL_MESSAGES.PARAMETERS_NOT_PROVIDED);
    }

    // const existingBooking = await prisma.booking.findFirst({
    //   where: {
    //     userId,
    //     OR: [{ clientPhone }, { clientEmail }],
    //     date: bookingDate,
    //   },
    // });

    // if (existingBooking) {
    //   throw new AppError(BOOKING_MESSAGES.BOOKING_ALREADY_EXISTS);
    // }

    const availability = await AvailabilitiesServices.getAvailabilityByDate(date, userId);
    if (!availability || !availability.times.includes(hour)) {
      throw new AppError(AVAILABILITY_MESSAGES.TIME_SLOT_UNAVAILABLE);
    }

    const user = await getUser(userId);
    if (!user) {
      throw new Error(USER_MESSAGE.NOT_FOUND);
    }

    if (user.googleTokens) {
      const event = await GoogleService.createEvent(userId, "primary", data);
      if (!event?.id) {
        throw new Error(BOOKING_MESSAGES.GOOGLE_EVENT_CREATION_FAILED);
      }
      googleEventId = event.id;
    }

    const booking = await prisma.booking.create({
      data: { ...data, date: bookingDate, googleEventId },
    });

    createdBookingId = booking.id;

    const updated = await AvailabilitiesServices.deleteTimeFromAvailability(date, hour, userId);
    if (!updated) throw new Error(AVAILABILITY_MESSAGES.UPDATE_FAILED);


    return booking;
  } catch (error: any) {
    logger.error("Error scheduling booking:", error);

    if (createdBookingId) {
      await prisma.booking.delete({ where: { id: createdBookingId } }).catch((rollbackError) => {
        logger.error("Failed to rollback booking creation:", rollbackError);
      });
    }

    if (googleEventId) {
      await GoogleService.deleteEvent(data.userId, "primary", googleEventId).catch((rollbackError) => {
        logger.error("Failed to rollback Google Calendar event creation:", rollbackError);
      });
    }
    throw error
  }
};

export const cancelBooking = async (booking: Booking): Promise<void> => {
  const { id, date, hour, userId, googleEventId } = booking;
  const bookingDate = new Date(date)
  try {
    if (!id || !userId) {
      throw new Error(GENERAL_MESSAGES.PARAMETERS_NOT_PROVIDED);
    }
    await prisma.booking.delete({ where: { id } });
    await AvailabilitiesServices.addTimeToAvailability(bookingDate, hour, userId);

    const user = await getUser(userId);
    if (user?.googleTokens && googleEventId) {
      await GoogleService.deleteEvent(userId, "primary", googleEventId);
    }
  } catch (error: any) {
    throw error
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

export const updateBooking = async (newBooking: Booking, oldBooking: Booking): Promise<Booking> => {
  try {
    newBooking.date = new Date(newBooking.date)
    oldBooking.date = new Date(oldBooking.date)
    if (!(dayjs(newBooking.date).isSame(oldBooking.date)) || newBooking.hour != oldBooking.hour) {
      const scheduled = await scheduleBooking(newBooking)
      if (scheduled) {
        await cancelBooking(oldBooking)
      }
      return scheduled
    }
    else {
      return await prisma.booking.update({ where: { id: oldBooking.id }, data: { ...newBooking } })
    }
  } catch (error) {
    logger.error("error with updateBooking controller")
    throw error
  }
}




