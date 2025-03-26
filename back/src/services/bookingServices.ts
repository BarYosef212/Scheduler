import { PrismaClient } from "@prisma/client";
import { Booking } from '../types/modelsTypes'
import { addTimeToAvailabilityService, deleteTimeFromAvailabilityService, getAvailabilityByDateService } from "./availabilitiesServices";
const prisma = new PrismaClient()

export const scheduleBooking = async (data: Booking, updatedFromId?: string): Promise<boolean> => {
  try {
    const { date, hour } = data

    const availability = await getAvailabilityByDateService(date)
    if (!availability || !availability.times.includes(hour)) {
      return false
    }

    const deleteResult = await deleteTimeFromAvailabilityService(date, hour)
    if (!deleteResult) return false

    if (updatedFromId) {
      data.updatedFromId = updatedFromId
    }

    const booking = await prisma.booking.create({
      data
    })

    return true
  } catch (error) {
    console.error("error in scheduleBooking service")
    return false
  }
}

export const cancelBooking = async (booking: Booking): Promise<boolean> => {
  try {
    const { id, date, hour } = booking
    await prisma.booking.update({
      where: { id: id },
      data: {
        status: 'CANCELLED'
      }
    })
    const added = await addTimeToAvailabilityService(date, hour)
    return added ? true : false
  } catch (error) {
    console.error("error in cancelBooking")
    return false
  }

}


