import { Prisma, PrismaClient } from "@prisma/client";
import { Availability } from '../types/modelsTypes'
import dayjs from "dayjs";
import logger from "../config/logger";
const prisma = new PrismaClient()


export const getAvailabilities = async (userId: string): Promise<Availability[]> => {
  try {
    const availabilities = await prisma.availability.findMany({ where: { userId: userId } })
    return availabilities
  } catch (error) {
    logger.error("error in getAvailabilitiesService: ", error)
    throw error
  }
}

export const deleteTimeFromAvailability = async (
  date: Date,
  hour: string,
  userId: string,
  tx?: Prisma.TransactionClient
): Promise<Availability> => {
  try {
    const prismaClient = tx || prisma;

    if (!date || !hour || !userId) {
      throw new Error("Missing required fields");
    }
    if (!dayjs(date).isValid()) {
      throw new Error("Invalid date format");
    }
    const availabilityDate = new Date(date);

    const availability = await prismaClient.availability.findFirst({
      where: { userId, date: availabilityDate },
    });

    if (!availability) {
      throw new Error("Availability not found");
    }
    if (!availability.times.includes(hour)) {
      throw new Error("Time slot not found in availability");
    }

    const updatedTimes = availability.times.filter((time) => time !== hour);
    const updatedAvailability = await prismaClient.availability.update({
      where: { id: availability.id },
      data: { times: updatedTimes },
    });

    return updatedAvailability;
  } catch (error: any) {
    throw new Error(`Failed to delete time from availability: ${error.message}`);
  }
};

export const deleteTimesFromAvailability = async (date: Date, start: Date, end: Date, userId: string): Promise<boolean> => {
  try {
    const availability = await getAvailabilityByDate(date, userId);
    if (!availability) return false;

    const startTime = formatTime(start);
    const endTime = formatTime(end);

    availability.times = availability.times.filter(time => {
      let [timeStart, timeEnd] = time.split(' - ');
      timeStart = timeStart.padStart(5, '0')
      timeEnd = timeEnd.padStart(5, '0')
      return !(
        (timeStart >= startTime && timeStart < endTime) ||
        (timeEnd > startTime && timeEnd <= endTime)
      );
    });

    if (availability.times.length == 0) await prisma.availability.delete({ where: { id: availability.id } })
    else {
      await prisma.availability.update({
        where: { id: availability.id },
        data: { ...availability }
      })
    }

    return true;
  } catch (error) {
    logger.error(error);
    throw error;
  }
};



const formatTime = (time: Date): string => {
  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

export const addTimeToAvailability = async (
  date: Date,
  hour: string,
  userId: string,
  tx?: Prisma.TransactionClient
): Promise<Availability> => {
  try {
    const prismaClient = tx || prisma;

    if (!date || !hour || !userId) {
      throw new Error("Missing required fields");
    }
    if (!dayjs(date).isValid()) {
      throw new Error("Invalid date format");
    }

    const availability = await getAvailabilityByDate(date, userId);
    if (!availability) {
      throw new Error("Availability not found");
    }
    if (availability.times.includes(hour)) {
      throw new Error("Time slot already exists in availability");
    }

    const updatedTimes = [...availability.times, hour].sort((a, b) => {
      const aStartTime = timeStringToDate(a.split(" - ")[0]);
      const bStartTime = timeStringToDate(b.split(" - ")[0]);
      return aStartTime.getTime() - bStartTime.getTime();
    });

    const updatedAvailability = await prismaClient.availability.update({
      where: { id: availability.id },
      data: { times: updatedTimes },
    });

    return updatedAvailability;
  } catch (error: any) {
    throw new Error(`Failed to add time to availability: ${error.message}`);
  }
};

export const checkIfAvailabilitiesOverlapping = async (date: Date, times: string[], userId: string): Promise<boolean> => {
  try {
    const existingAvailabilities = await prisma.availability.findFirst({
      select: { times: true },
      where: { userId: userId, date: date }
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
          return true
        }
      }
    }

    return false
  } catch (error) {
    logger.error("error in checkIfAvailabilitiesOverlapping: ", error)
    throw error
  }
};

export const createAvailabilities = async (times: string[], date: Date, userId: string): Promise<boolean> => {
  try {
    const availability = await prisma.availability.findFirst({ where: { userId: userId, date: date } })
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
    logger.error("error in createAvailabilities: ", error)
    throw error
  }

}

export const getAvailabilityByDate = async (date: Date, userId: string): Promise<Availability | null> => {
  try {
    const utcDate = new Date(
      Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
      ),
    );

    const availability = await prisma.availability.findFirst({
      where: {
        userId: userId,
        date: utcDate
      }
    })
    return availability
  } catch (error) {
    logger.error("error in getAvailabilityByDateService")
    throw error
  }
}

function timeStringToDate(timeString: string) {
  const [hours, minutes] = timeString.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
}
