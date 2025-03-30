import { PrismaClient } from "@prisma/client";
import { Booking } from '../types/modelsTypes'
import { addTimeToAvailability, deleteTimeFromAvailability, getAvailabilityByDate } from "./availabilitiesServices";
const prisma = new PrismaClient()

export const scheduleBooking = async (data: Booking): Promise<Booking | null> => {
  try {
    const { date, hour } = data

    const availability = await getAvailabilityByDate(date)
    if (!availability || !availability.times.includes(hour)) return null

    const booking = await prisma.booking.create({
      data
    })

    if (!booking) return null
    const deleted = await deleteTimeFromAvailability(date, hour)

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
    const { id, date, hour } = booking
    const added = await addTimeToAvailability(date, hour)
    if (!added) return false

    const updatedBooking = await prisma.booking.update({
      where: { id: id },
      data: {
        status: 'CANCELLED'
      }
    })

    if (!updatedBooking) {
      await deleteTimeFromAvailability(date, hour);
      return false;
    }
    return true

  } catch (error) {
    console.error("error in cancelBooking")
    throw error
  }
}


export const getAllBookings = async (): Promise<Booking[] | null> => {
  try {
    const bookings = await prisma.booking.findMany({})
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

    const updatedOldBooking = await prisma.booking.update({
      where: { id: oldBooking.id },
      data: {
        status: "UPDATED",
      }
    })

    if (!updatedOldBooking) {
      return false
    }

    const booked = await scheduleBooking(newBooking)
    if (!booked) {
      await prisma.booking.update({
        where: { id: oldBooking.id },
        data: {
          status: "CONFIRMED",
        }
      })
      return false
    }

    const canceled = await cancelBooking(oldBooking)
    if (!canceled) {
      await prisma.booking.update({
        where: { id: oldBooking.id },
        data: {
          status: "CONFIRMED",
        }
      })
      await prisma.booking.delete({ where: { id: booked.id } })
      return false
    }

    return true
  } catch (error) {
    console.error("error with updateBooking controller")
    throw error
  }
}