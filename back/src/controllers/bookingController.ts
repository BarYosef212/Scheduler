import { Request, Response } from "express";
import { PrismaClient, Prisma } from "@prisma/client";
import * as service from '../services/bookingServices'
import { Booking } from "../types/modelsTypes";
const prisma = new PrismaClient()


export const scheduleBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { date, hour, userId, clientName, clientEmail, clientPhone }: Booking = req.body
    const data = {
      date: date,
      hour: hour,
      userId: userId,
      clientName: clientName,
      clientEmail: clientEmail || null,
      clientPhone: clientPhone
    }

    const response = await service.scheduleBooking(data)
    response ? res.json({ message: "done" }) : res.status(400).json({ message: "שגיאה בעת הזמנת התור, אנא נסה שנית" })
    return

  } catch (error) {
    console.error("error in schedule booking controller")
    res.status(500).json({
      message: "error occurred, please try again later"
    })
  }
}

export const getBookings = async (req: Request, res: Response): Promise<void> => {
  try {
    const bookings = await prisma.booking.findMany({
      where: {
        status: "CONFIRMED"
      }
    })
    if (bookings) {
      res.json({
        bookings
      })
    }
  } catch (error) {
    console.error("error with getBookings controller")
    res.status(500).json({
      message: "error occurred, please try again later"
    })
  }
}

export const cancelBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { booking } = req.body
    const deleted = await service.cancelBooking(booking)
    if (deleted) res.sendStatus(200)
    else res.status(400).json({ message: "שגיאה בעת ביטול התור" })

  } catch (error) {
    console.error("error with cancelBooking controller")
    res.status(500).json({
      message: "error occurred, please try again later"
    })
  }
}

export const updateBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { newBooking, oldBooking } = req.body
    newBooking.date = new Date(newBooking.date)

    const booked = await service.scheduleBooking(newBooking, oldBooking.id)

    if (!booked) {
      res.status(400).json({ message: "שגיאה בעת עדכון התור" })
      return
    }
    await service.cancelBooking(oldBooking)
    await prisma.booking.update({
      where: { id: oldBooking.id },
      data: {
        status: "UPDATED",
      }
    })

    res.json({
      message: "התור עודכן"
    })
  } catch (error) {
    console.error("error with updateBooking controller")
    res.status(500).json({
      message: "error occurred, please try again later"
    })
  }
}

