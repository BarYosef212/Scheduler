import { Request, Response } from "express";
import * as service from '../services/bookingServices';
import { Booking } from "../types/modelsTypes";
import { BOOKING_MESSAGES, GENERAL_MESSAGES } from "./messages";
import { getUser } from "../services/userServices";
import * as mailer from '../services/mailer';
import HTTP from "../constants/status";
import sendErrorResponse from "../utils/errorHandler";

export const scheduleBooking = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { date, hour, clientName, clientEmail, clientPhone }: Booking = req.body;
    const { userId } = req.params;
    if (!date || !hour || !clientName || !clientPhone || !userId) {
      return sendErrorResponse(res, HTTP.StatusCodes.BAD_REQUEST, `Error in scheduleBooking controller: ${GENERAL_MESSAGES.PARAMETERS_NOT_PROVIDED}`);
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
    await mailer.sendAppointmentUpdate(user.email, clientEmail, subject, text, logo);

    return res.json({ Booking });

  } catch (error: any) {
    return sendErrorResponse(res, HTTP.StatusCodes.INTERNAL_SERVER_ERROR, `Error in scheduleBooking controller: ${error.message}`);
  }
};

export const getBookingsById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { userId } = req.params;
    const bookings = await service.getAllBookingsById(userId);

    if (bookings) {
      return res.json({ bookings: bookings });
    }
    return sendErrorResponse(res, HTTP.StatusCodes.BAD_REQUEST, `Error in getBookingsById controller: ${GENERAL_MESSAGES.API_ERROR}`);
  } catch (error) {
    return sendErrorResponse(res, HTTP.StatusCodes.INTERNAL_SERVER_ERROR, `Error in getBookingsById controller: ${GENERAL_MESSAGES.API_ERROR}`);
  }
};

export const cancelBooking = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { booking }: { booking: Booking } = req.body;
    const { clientEmail, userId, clientName, hour } = booking;
    await service.cancelBooking(booking);
    const user = await getUser(userId);
    const subject = `בוטל תור ל-${user.userName}`;
    const text = `שלום <b>${clientName}</b>,<br>בוטל התור ל-${user.userName} בתאריך ${new Date().toLocaleDateString('he-IL')} בשעה ${hour}.`;
    const logo = user.logo || undefined;

    await mailer.sendAppointmentUpdate(user.email, clientEmail, subject, text, logo);
    return res.sendStatus(HTTP.StatusCodes.OK)
  } catch (error) {
    return sendErrorResponse(res, HTTP.StatusCodes.INTERNAL_SERVER_ERROR, `Error in cancelBooking controller: ${GENERAL_MESSAGES.UNKNOWN_ERROR}`);
  }
};

export const updateBooking = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { newBooking, oldBooking }: { newBooking: Booking, oldBooking: Booking } = req.body;
    const { clientEmail, userId, clientName, date, hour } = newBooking;

    const booked = await service.updateBooking(newBooking, oldBooking);

    if (!booked) {
      return sendErrorResponse(res, HTTP.StatusCodes.BAD_REQUEST, `Error in updateBooking controller: ${BOOKING_MESSAGES.FAIL_UPDATE_BOOKING}`);
    }

    if (clientEmail) {
      const user = await getUser(userId);
      const subject = `עדכון תור ל-${user.userName}`;
      const text = `שלום <b>${clientName}</b>,<br>התור שלך ל-${user.userName} עודכן.<br><b>תור קודם:</b> ${new Date(oldBooking.date).toLocaleDateString('he-IL')} בשעה ${oldBooking.hour}.<br><b>תור חדש:</b> ${new Date(date).toLocaleDateString('he-IL')} בשעה ${hour}.`;
      const logo = user.logo || undefined;
      await mailer.sendAppointmentUpdate(user.email, clientEmail, subject, text, logo);
    }
    return res.json({
      message: BOOKING_MESSAGES.SUCCESS_UPDATE
    });
  } catch (error) {
    return sendErrorResponse(res, HTTP.StatusCodes.INTERNAL_SERVER_ERROR, `Error in updateBooking controller: ${GENERAL_MESSAGES.UNKNOWN_ERROR}`);
  }
};
