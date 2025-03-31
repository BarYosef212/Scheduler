import { PrismaClient } from "@prisma/client";
import { Booking } from '../types/modelsTypes'
import { addTimeToAvailability, deleteTimeFromAvailability, getAvailabilityByDate } from "./availabilitiesServices";
import { BookingStatus } from "@prisma/client";
import dayjs from "dayjs";

const prisma = new PrismaClient()

export const scheduleBooking = async (data: Booking): Promise<Booking | null> => {
  try {
    const { date, hour,userId } = data

    const availability = await getAvailabilityByDate(date, userId)
    if (!availability || !availability.times.includes(hour)) return null


    const booking = await prisma.booking.create({
      data
    })

    if (!booking) return null
    const deleted = await deleteTimeFromAvailability(date, hour, userId)
    if (!deleted) {
      await prisma.booking.delete({ where: { id: booking.id } });
      return null;
    }

    return booking

  } catch (error) {
    console.error("error in scheduleBooking service")
    throw error
  }
}

export const cancelBooking = async (booking: Booking): Promise<boolean> => {
  try {
    const { id, date, hour,userId } = booking
    const newDate = new Date(date)
    const added = await addTimeToAvailability(newDate, hour,userId)
    if (!added) return false


    const updatedBooking = await prisma.booking.update({
      where: { id: id },
      data: {
        status: BookingStatus.CANCELLED
      }
    })

    if (!updatedBooking) {
      await deleteTimeFromAvailability(date, hour,userId);
      return false;
    }
    return true

  } catch (error) {
    console.error("error in cancelBooking")
    throw error
  }
}


export const getAllBookingsById = async (id: string): Promise<Booking[] | null> => {
  try {
    const bookings = await prisma.booking.findMany({ where: { userId: id } })
    if (!bookings) {
      return null
    }
    return bookings
  } catch (error) {
    console.error("error with getBookings controller")
    throw error
  }
}

export const updateBooking = async (newBooking: Booking, oldBooking: Booking): Promise<boolean> => {
  try {

    newBooking.date = new Date(newBooking.date)
    oldBooking.date = new Date(oldBooking.date)
    if (!(dayjs(newBooking.date).isSame(oldBooking.date)) || newBooking.hour != oldBooking.hour) {
      newBooking.updatedFromId = oldBooking.id

      const updatedOldBooking = await prisma.booking.update({
        where: { id: oldBooking.id },
        data: {
          status: BookingStatus.UPDATED,
        }
      })

      if (!updatedOldBooking) {
        return false
      }

      newBooking.createdAt = undefined
      const booked = await scheduleBooking(newBooking)
      if (!booked) {
        await prisma.booking.update({
          where: { id: oldBooking.id },
          data: {
            status: BookingStatus.CONFIRMED,
          }
        })
        return false
      }

      const canceled = await cancelBooking(oldBooking)
      if (!canceled) {
        await prisma.booking.update({
          where: { id: oldBooking.id },
          data: {
            status: BookingStatus.CONFIRMED,
          }
        })
        await prisma.booking.delete({ where: { id: booked.id } })
        return false
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