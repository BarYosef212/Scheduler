import {BookingStatus} from '@prisma/client'

export interface User {
  id: string,
  email: string,
  name: string,
  password: string,
}

export interface Booking {
  id?: string,
  status?: BookingStatus,
  date: Date,
  hour: string,
  userId: string,
  clientName: string,
  clientEmail?: string | null,
  clientPhone: string,
  createdAt?: Date
  updatedFromId?: string
}

export interface Availability {
  id: string
  userId: string
  date: Date
  times: string[]
  createdAt: Date
}