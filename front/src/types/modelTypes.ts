export interface User {
  id: string,
  email: string,
  userName: string,
  password: string,
  daysExcluded: number[]
  logo?: string,
  title?: string,
  googleTokens?: any
}

export interface Booking {
  id?: string,
  date: Date,
  hour: string,
  userId: string,
  clientName: string,
  clientEmail: string,
  clientPhone: string,
  createdAt?: Date
  googleEventId: string
}

export interface Availability {
  id: string
  userId: string
  date: Date
  times: string[]
  createdAt: Date
}