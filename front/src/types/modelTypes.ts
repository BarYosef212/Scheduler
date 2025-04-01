export interface Booking {
  id?: string,
  status?: 'CONFIRMED' | 'CANCELLED',
  date: Date,
  hour: string,
  userId: string,
  clientName: string,
  clientEmail: string | null,
  clientPhone: string,
  createdAt:Date
}


export interface Availability {
  id: string
  userId: string
  date: Date
  times: string[]
  createdAt: Date
  updatedAt: Date
}

export interface User {
  id: string,
  email: string,
  userName: string,
  password: string,
  daysExcluded: number[]
  logo: string | null,
  title: string
}
