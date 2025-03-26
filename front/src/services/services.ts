import axios from "axios";
import { Booking, Availability } from "../types/modelTypes";
import dayjs from "dayjs";

const api = axios.create({
  baseURL: "http://localhost:3000/api/"
})


export const filterAvailabilitiesHours = (allTimes: Availability[], dateSelected: Date): string[] => {
  const date = allTimes.filter((e) => dayjs(e.date).isSame(dateSelected, "day"))
  return date[0]?.times
}

export const filterBookingsByDate = (bookings: Booking[], dateSelected: Date): Booking[] => {
  const filteredBookings = bookings.filter((booking) => dayjs(booking.date).isSame(dateSelected, "day"))
  const sortedBookings = sortBookings(filteredBookings)
  return sortedBookings
}

export const getAvailabilities = async (): Promise<Availability[]> => {
  try {
    const res = await api.get<{ availabilities: Availability[] }>('/getAvailabilities');
    const list = res.data.availabilities || []
    return list
  } catch (error) {
    console.log(error)
    return []
  }
}

export const scheduleBooking = async (data: Booking): Promise<number | void> => {
  try {
    const { date } = data
    const utcDate = new Date(
      Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
      ),
    );
    data.date = utcDate
    const response = await api.post('/scheduleBooking', data)
    return response.status
  } catch (error) {
    console.log(error)
  }
}

export const getBookings = async (): Promise<Booking[]> => {
  try {
    const response = await api.get<{ bookings: Booking[] }>('/getBookings');
    return response.data.bookings;
  } catch (error) {
    console.log(error);
    return [];
  }
};



const sortBookings = (bookings: Booking[]) => {
  return bookings.sort((a, b) => {
    const getStartTimeInMinutes = (time: string) => {
      const [startTime] = time.split(" - ");
      const [hours, minutes] = startTime.split(":").map(Number);
      return hours * 60 + minutes;
    };

    const aStartTime = getStartTimeInMinutes(a.hour);
    const bStartTime = getStartTimeInMinutes(b.hour);

    return aStartTime - bStartTime;
  });
};


export const cancelBookingService = async (booking: Booking) => {
  try {
    const response = await api.post('/cancelBooking', booking)
  } catch (error) {
    console.log(error)
  }

}

export const updateBooking = async (newBooking: Booking, oldBooking: Booking): Promise<string> => {
  try {
    const response = await api.put<{ message: string }>('/updateBooking', { newBooking, oldBooking })
    return response.data.message

  } catch (error: any) {
    return error.response.data.message
  }
}

export const createAvailabilities = async (interval: number, startTime: Date, endTime: Date, date: Date) => {
  try {

    const utcDate = new Date(
      Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
      ),
    );
    const times = createListOfTimes(interval, startTime, endTime)

    const response = await api.post<{ message: string }>('/createAvailabilities', { times, date: utcDate, userId: "1" })
    return response.data.message
  } catch (error: any) {
    console.log(error)
    return error.response.data.message
  }
}

const createListOfTimes = (interval: number, startTime: Date, endTime: Date): string[] => {
  const times = []
  while (startTime < endTime) {
    const endBookingTime = new Date(startTime.getTime())
    endBookingTime.setMinutes(endBookingTime.getMinutes() + interval)
    if (endBookingTime > endTime) break;
    const bookingTimeStr = `${startTime.getHours()}:${startTime.getMinutes().toString().padStart(2, '0')} - ${endBookingTime.getHours()}:${endBookingTime.getMinutes().toString().padStart(2, '0')}`
    startTime = endBookingTime
    times.push(bookingTimeStr)
  }
  return times
}