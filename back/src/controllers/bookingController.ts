import { Request, Response } from "express";
import * as service from '../services/bookingServices';
import { Booking } from "../types/modelsTypes";
import { BOOKING_MESSAGES, GENERAL_MESSAGES } from "../constants/messages";
import { getUser, updateUser } from "../services/userServices";
import * as mailer from '../services/mailer';
import HTTP from "../constants/status";
import { sendErrorResponse, catchFunc } from "../utils/errorHandler";
import dayjs from "dayjs";
import { deleteTimesFromAvailability } from "../services/availabilitiesServices";

export const scheduleBooking = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { date, hour, clientName, clientEmail, clientPhone }: Booking = req.body;
    const { userId } = req.params;
    if (!date || !hour || !clientName || !clientPhone || !userId) {
      return sendErrorResponse(res, HTTP.StatusCodes.BAD_REQUEST, `${GENERAL_MESSAGES.PARAMETERS_NOT_PROVIDED}`);
    }
    const data = {
      date: new Date(date),
      userId: userId,
      hour: hour,
      clientName: clientName,
      clientEmail: clientEmail,
      clientPhone: clientPhone,
      googleEventId: '0'
    };

    const Booking = await service.scheduleBooking(data);

    const user = await getUser(userId);
    const subject = `נקבע תור חדש ל-${user.userName}`;
    const text = `שלום <b>${clientName}</b>,<br>נקבע תור חדש ל-${user.userName} בתאריך ${new Date(date).toLocaleDateString('he-IL')} בשעה ${data.hour}.`;
    const logo = user.logo || undefined;
    await mailer.sendAppointmentUpdate(clientEmail, subject, text, logo);

    if (dayjs(date).isSame(new Date())) {
      const subject = `תור חדש במערכת תורים`;
      const text = `שלום <b>${user.userName}</b>,<br>נקבע להיום תור חדש עבור ${clientName} בשעה ${data.hour}`;
      const logo = user.logo || undefined;
      await mailer.sendAppointmentUpdate(user.email, subject, text, logo);
    }

    return res.json({ Booking });

  } catch (error: any) {
    return catchFunc(error, res)
  }
};

export const getBookingsById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { userId } = req.params;
    const bookings = await service.getAllBookingsById(userId);

    if (bookings) {
      return res.json({ bookings: bookings });
    }

    return sendErrorResponse(res, HTTP.StatusCodes.BAD_REQUEST, HTTP.ReasonPhrases.BAD_REQUEST, `Error in getBookingsById controller: ${GENERAL_MESSAGES.API_ERROR}`);

  } catch (error: any) {
    return catchFunc(error, res)
  }
};

export const cancelBooking = async (req: Request, res: Response, skipResponse = false): Promise<Response | void> => {
  try {
    const { booking }: { booking: Booking } = req.body;
    const { clientEmail, userId, clientName, hour } = booking;
    await service.cancelBooking(booking);
    const user = await getUser(userId);
    const subject = `בוטל תור ל-${user.userName}`;
    const text = `שלום <b>${clientName}</b>,<br>בוטל התור ל-${user.userName} בתאריך ${new Date(booking.date).toLocaleDateString('he-IL')} בשעה ${hour}.`;
    const logo = user.logo || undefined;

    await mailer.sendAppointmentUpdate(clientEmail, subject, text, logo);
    if (!skipResponse) return res.sendStatus(HTTP.StatusCodes.OK);
  } catch (error: any) {
    return catchFunc(error, res)
  }
};

export const cancelAllBookingsOnDate = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { userId } = req.params;
    const { date } = req.body;

    const newDate = new Date(date)

    const bookingsOfUser = await service.getAllBookingsById(userId)

    const bookings = bookingsOfUser.filter((booking) =>
      dayjs(booking.date).isSame(newDate, "day")
    );


    for (const booking of bookings) {
      req.body = { booking };
      await cancelBooking(req, res, true);
    }

    await deleteTimesFromAvailability(newDate, new Date(new Date().setHours(0, 0, 0, 0)), new Date(new Date().setHours(23, 59, 0, 0)), userId)


    return res.sendStatus(HTTP.StatusCodes.OK);
  } catch (error: any) {
    console.log("3")
    return catchFunc(error, res)
  }
};

export const updateBooking = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { newBooking, oldBooking }: { newBooking: Booking, oldBooking: Booking } = req.body;
    const { clientEmail, userId, clientName, date, hour } = newBooking;

    const booked = await service.updateBooking(newBooking, oldBooking);

    if (!booked) {
      return sendErrorResponse(res, HTTP.StatusCodes.BAD_REQUEST, BOOKING_MESSAGES.FAIL_UPDATE_BOOKING);
    }

    if (clientEmail) {
      const user = await getUser(userId);
      const subject = `עדכון תור ל-${user.userName}`;
      const text = `שלום <b>${clientName}</b>,<br>התור שלך ל-${user.userName} עודכן.<br><b>תור קודם:</b> ${new Date(oldBooking.date).toLocaleDateString('he-IL')} בשעה ${oldBooking.hour}.<br><b>תור חדש:</b> ${new Date(date).toLocaleDateString('he-IL')} בשעה ${hour}.`;
      const logo = user.logo || undefined;
      await mailer.sendAppointmentUpdate(clientEmail, subject, text, logo);
    }
    return res.json({
      message: BOOKING_MESSAGES.SUCCESS_UPDATE
    });
  } catch (error: any) {
    return catchFunc(error, res)
  }
};
