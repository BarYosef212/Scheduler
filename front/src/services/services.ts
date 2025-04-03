import axios from "axios";
import { Booking, Availability, User } from "../types/modelTypes";
import dayjs from "dayjs";

const api = axios.create({
  baseURL: "http://localhost:3000/api/"
})

api.interceptors.request.use((config) => {
  config.withCredentials = true
  return config;
});


export const filterAvailabilitiesHours = (allTimes: Availability[], dateSelected: Date): string[] => {
  const today = new Date()
  const currentHour = today.getHours()
  const currentMinute = new Date().getMinutes()
  const date = allTimes.filter((e) => dayjs(e.date).isSame(dateSelected, "day"))
  const times = date[0]?.times || []
  if (dayjs(today).isSame(dateSelected,"day")) {
    const filteredTimes = times.filter((time) => {
      const [hour, minute] = time.split('-')[0].split(':').map(Number)
      return hour > currentHour || ((hour == currentHour) && (minute > currentMinute))
    })
    return filteredTimes
  }
  return times
}

export const filterBookingsByDate = (bookings: Booking[], dateSelected: Date): Booking[] => {
  const filteredBookings = bookings.filter((booking) => dayjs(booking.date).isSame(dateSelected, "day"))
  const sortedBookings = sortBookings(filteredBookings)
  return sortedBookings
}

export const getAvailabilities = async (userId: string): Promise<Availability[]> => {
  try {
    const res = await api.get<{ availabilities: Availability[] }>(`/getAvailabilities/${userId}`);
    const list = res.data.availabilities || []
    return list
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const scheduleBooking = async (data: Booking, userId: string): Promise<number | void> => {
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
    const response = await api.post(`/scheduleBooking/${userId}`, data)
    return response.status
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const getConfirmedBookingsById = async (userId: string): Promise<Booking[]> => {
  try {
    const response = await api.get<{ bookings: Booking[] }>(`/getConfirmedBookings/${userId}`);
    return response.data.bookings;
  } catch (error) {
    console.log(error);
    throw error
  }
};

export const cancelBookingService = async (booking: Booking) => {
  try {
    const response = await api.post('/cancelBooking', { booking })
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }

}

export const updateBooking = async (newBooking: Booking, oldBooking: Booking): Promise<string> => {
  try {
    oldBooking.date = new Date(oldBooking.date)
    const response = await api.put<{ message: string }>('/updateBooking', { newBooking, oldBooking })
    return response.data.message

  } catch (error: any) {
    return error.response.data.message
  }
}

export const createAvailabilities = async (interval: number, startTime: Date, endTime: Date, date: Date, userId: string):Promise<string> => {
  try {

    const utcDate = new Date(
      Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
      ),
    );
    const times = createListOfTimes(interval, startTime, endTime)

    const response = await api.post<{ message: string }>(`/createAvailabilities/${userId}`, { times, date: utcDate })
    console.log(response)
    return response.data.message
  } catch (error: any) {
    console.log(error)
    throw error.response.data.message
  }
}

export const deleteAvailabilities = async (startTime: Date, endTime: Date, date: Date, userId: string) => {
  try {
    const response = await api.delete<{ message: string }>(`/deleteAvailabilities/${userId}`, { params: { startTime, endTime, date } })
    return response.data.message
  } catch (error: any) {
    console.log(error)
    return error.response.data.message
  }
}

export const getUser = async (userId: string): Promise<User | null> => {
  try {
    const response = await api.get<{ user: User }>('/getUser', { params: { userId: userId } })
    return response.data.user
  } catch (error) {
    console.log(error)
    return null
  }
}

export const login = async (email: string, password: string): Promise<string> => {
  try {
    const response = await api.post<{ message: string }>('/login', { email, password })
    return response.data.message
  } catch (error:any) {
    console.log(error)
    throw error.response.data.message
  }
}

export const logout = async (): Promise<string> => {
  try {
    const response = await api.post<{ message: string }>('/logout')
    return response.data.message
  } catch (error) {
    console.log(error)
    throw error
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


export const isAuthenticated = async (userId: string): Promise<boolean> => {
  try {
    const response = await api.get<{ isAuth: boolean }>(`/auth/protected/${userId}`)
    return response.data.isAuth
  } catch (error: any) {
    return error.response.data.isAuth
  }
}

export const updateUser = async(userId:string,data:Partial<User>):Promise<string>=>{
  try {
    const response = await api.put<{message:string}>(`/updateUser/${userId}`,{data})
    return response.data.message
  } catch (error:any) {
    console.log(error)
    return error.response.data.message
  }
}