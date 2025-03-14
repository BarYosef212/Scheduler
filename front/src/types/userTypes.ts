export interface Booking {
  id: number,
  name: string,
  date: Date,
  userId: number,
  clientName: string,
  clientEmail: string | null,
  clientPhone: string,
}


export interface Availability {
  id: string
  userId: string
  date: string
  times: string[]
  createdAt: Date
  updatedAt: Date
}