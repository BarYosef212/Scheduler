import { PrismaClient } from "@prisma/client";
import { Availability } from '../types/modelsTypes'
const prisma = new PrismaClient()


export const getAvailabilities = async (): Promise<Availability[]> => {
  try {
    const availabilities = await prisma.availability.findMany({})
    return availabilities
  } catch (error) {
    console.error("error in getAvailabilitiesService: ", error)
    throw error
  }
}

export const deleteTimeFromAvailability = async (date: Date, hour: string): Promise<boolean> => {
  try {
    const availability = await getAvailabilityByDate(date)
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
    console.error("error in deleteTimeFromAvailabilityService: ", error)
    throw error
  }
}


export const deleteTimesFromAvailability = async (date: Date, start: Date, end: Date): Promise<boolean> => {
  try {
    const availability = await getAvailabilityByDate(date);
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
    console.log(error);
    throw error;
  }
};



const formatTime = (time: Date): string => {
  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

const updateAvailability = async (availability: any) => {
  console.log('Updated availability:', availability);
  return true;
};



export const addTimeToAvailability = async (date: Date, hour: string): Promise<boolean> => {
  try {
    const availability = await getAvailabilityByDate(date)
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
    console.error("error in addTimeToAvailabilityService: ", error)
    throw error
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

    return false
  } catch (error) {
    console.error("error in checkIfAvailabilitiesOverlapping: ", error)
    throw error
  }
};

export const createAvailabilities = async (times: string[], date: Date, userId: string): Promise<boolean> => {
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
    console.error("error in createAvailabilities: ", error)
    throw error
  }

}

export const getAvailabilityByDate = async (date: Date): Promise<Availability | null> => {
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
        date: utcDate
      }
    })
    return availability
  } catch (error) {
    console.error("error in getAvailabilityByDateService")
    throw error
  }
}

function timeStringToDate(timeString: string) {
  const [hours, minutes] = timeString.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
}
