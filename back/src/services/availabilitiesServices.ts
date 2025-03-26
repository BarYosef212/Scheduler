import { PrismaClient } from "@prisma/client";
import { Prisma } from '@prisma/client';
import { User, Booking, Availability } from '../types/modelsTypes'
const prisma = new PrismaClient()


export const getAvailabilitiesService = async (): Promise<Partial<Availability>[]> => {
  try {
    const availabilities = await prisma.availability.findMany({
      select: {
        date: true,
        times: true
      }
    })
    return availabilities
  } catch (error) {
    console.error("error in getAvailabilitiesService")
    return []
  }
}


export const getAvailabilityByDateService = async (date: Date): Promise<Availability | null> => {
  try {
    const availability = await prisma.availability.findFirst({
      where: {
        date: date
      }
    })
    return availability
  } catch (error) {
    console.error("error in getAvailabilityByDateService")
    return null
  }
}


export const deleteTimeFromAvailabilityService = async (date: Date, hour: string): Promise<boolean> => {
  try {
    const availability = await getAvailabilityByDateService(date)
    if (!availability) return false
    const newTimes = availability.times.filter((hourValue) => hourValue != hour)
    await prisma.availability.update({
      where: {
        id: availability.id
      },
      data: {
        times: newTimes
      }
    })

    return true
  } catch (error) {
    console.error("error in deleteTimeFromAvailabilityService")
    return false
  }
}

function timeStringToDate(timeString: string) {
  const [hours, minutes] = timeString.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
}


export const addTimeToAvailabilityService = async (date: Date, hour: string): Promise<boolean> => {
  try {
    const availability = await getAvailabilityByDateService(date)
    if (!availability) return false
    if (availability.times.includes(hour)) return false
    availability.times.push(hour)

    availability.times.sort((a, b) => {
      const aStartTime = timeStringToDate(a.split(' - ')[0]);
      const bStartTime = timeStringToDate(b.split(' - ')[0]);
      return aStartTime.getTime() - bStartTime.getTime();
    });

    await prisma.availability.update({
      where: {
        id: availability.id
      },
      data: {
        times: availability.times
      }
    })

    return true
  } catch (error) {
    console.error("error in addTimeToAvailabilityService")
    return false
  }
}

export const checkIfAvailabilitiesOverlapping = async (date: Date, times: string[]): Promise<boolean> => {
  try {
    const existingAvailabilities = await prisma.availability.findFirst({
      select: { times: true },
      where: { date: date }
    })

    if (!existingAvailabilities) return false
    const existingTimes = existingAvailabilities.times.map((time) => {
      const [start, end] = time.split(" - ")

      return {
        startHour: parseInt(start.split(":")[0], 10),
        startMinute: parseInt(start.split(":")[1], 10),
        endHour: parseInt(end.split(":")[0], 10),
        endMinute: parseInt(end.split(":")[1], 10)
      }
    })

    for (const time of times) {
      const [startTime, endTime] = time.split(" - ")
      const newStartHour = parseInt(startTime.split(":")[0], 10)
      const newStartMinute = parseInt(startTime.split(":")[1], 10)
      const newEndHour = parseInt(endTime.split(":")[0], 10)
      const newEndMinute = parseInt(endTime.split(":")[1], 10)


      for (const existing of existingTimes) {
        const existingStartInMinutes = existing.startHour * 60 + existing.startMinute;
        const existingEndInMinutes = existing.endHour * 60 + existing.endMinute
        const newStartInMinutes = newStartHour * 60 + newStartMinute
        const newEndInMinutes = newEndHour * 60 + newEndMinute

        if ((newStartInMinutes >= existingStartInMinutes && newStartInMinutes < existingEndInMinutes) ||
          (newEndInMinutes > existingStartInMinutes && newEndInMinutes <= existingEndInMinutes) ||
          (newStartInMinutes <= existingStartInMinutes && newEndInMinutes >= existingEndInMinutes)) {
          console.log('overlap detected')
          return true
        }
      }
    }

    console.log("no overlaops")
    return false
  } catch (error) {
    console.log(error)
    return false
  }
};

export const createAvailabilities = async (times: string[], date: Date, userId: string):Promise<boolean> => {
  try {
    const availability = await prisma.availability.findFirst({ where: { date: date } })
    if (availability) {
      const newTimes = availability.times
      newTimes.push(...times)
      await prisma.availability.update({ where: { id: availability.id }, data: { times: newTimes } })
      return true
    }
    else {
      await prisma.availability.create({
        data: {
          times: times,
          date: date,
          userId: userId
        }
      })
      return true
    }
  } catch (error) {
    console.log(error)
    return false
  }
  
}