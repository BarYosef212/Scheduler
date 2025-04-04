import { BookingStatus } from '@prisma/client'

export interface User {
  id: string,
  email: string,
  userName: string,
  password: string,
  daysExcluded: number[]
  logo?: string,
  title?: string
}

export interface Booking {
  id?: string,
  status?: BookingStatus,
  date: Date,
  hour: string,
  userId: string,
  clientName: string,
  clientEmail: string,
  clientPhone: string,
  createdAt?: Date
  updatedFromId?: string | null
}

export interface Availability {
  id: string
  userId: string
  date: Date
  times: string[]
  createdAt: Date
}