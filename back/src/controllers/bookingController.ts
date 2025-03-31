import { Request, Response } from "express";
import * as service from '../services/bookingServices'
import { Booking } from "../types/modelsTypes";
import { BOOKING_MESSAGES, AVAILABILITY_MESSAGES, GENERAL_MESSAGES } from "./messages";
import { BookingStatus } from "@prisma/client";


export const scheduleBooking = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { date, hour, clientName, clientEmail, clientPhone }: Booking = req.body
    const {userId} = req.params
    if (!date || !hour || !clientName || !clientPhone  || !userId) {
      return res.status(400).json({ message: GENERAL_MESSAGES.PARAMETERS_NOT_PROVIDED })
    }
    const data = {
      date: new Date(date),
      userId:userId,
      hour: hour,
      clientName: clientName,
      clientEmail: clientEmail || null,
      clientPhone: clientPhone
    }


    const Booking = await service.scheduleBooking(data)
    return Booking ? res.json({ Booking }) : res.status(400).json({ message: BOOKING_MESSAGES.FAIL_NEW_BOOKING })
  } catch (error) {
    console.error("error in schedule booking controller: ", error)
    return res.status(500).json({
      message: GENERAL_MESSAGES.UNKNOWN_ERROR
    })
  }
}

export const getConfirmedBookings = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {userId} = req.params
    const bookings = await service.getAllBookingsById(userId)

    if (bookings) {
      const filtered = bookings.filter((booking) => booking.status == BookingStatus.CONFIRMED)
      return res.json({ bookings: filtered })
    }
    return res.status(400).json({ message: GENERAL_MESSAGES.API_ERROR })
  } catch (error) {
    console.error("error with getBookings controller")
    return res.status(500).json({
      message: GENERAL_MESSAGES.UNKNOWN_ERROR
    })
  }
}

export const cancelBooking = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { booking } = req.body
    const canceled = await service.cancelBooking(booking)
    if (canceled) return res.sendStatus(200)
    else return res.status(400).json({ message: BOOKING_MESSAGES.FAIL_CANCEL_BOOKING })

  } catch (error) {
    console.error("error with cancelBooking controller: ",error)
    return res.status(500).json({
      message: GENERAL_MESSAGES.UNKNOWN_ERROR
    })
  }
}

export const updateBooking = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { newBooking, oldBooking }:{newBooking:Booking,oldBooking:Booking}= req.body


    const booked = await service.updateBooking(newBooking,oldBooking)

    if (!booked) {
      return res.status(400).json({ message: BOOKING_MESSAGES.FAIL_UPDATE_BOOKING })
    }

    return res.json({
      message: BOOKING_MESSAGES.SUCCESS_UPDATE
    })
  } catch (error) {
    console.error("error with updateBooking controller")
    return res.status(500).json({
      message: GENERAL_MESSAGES.UNKNOWN_ERROR
    })
  }
}

