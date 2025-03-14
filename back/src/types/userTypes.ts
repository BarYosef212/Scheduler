export interface User{
  id:string,
  email:string,
  name:string,
  password:string,
  appointmentIntervalInMinutes:number,
  workDays:number[],
  workHoursStart:string,
  workHoursEnd:string,
}

export interface Booking{
  id:string,
  name:string,
  date:Date,
  userId:string,
  clientName:string,
  clientEmail:string | null,
  clientPhone:string,
}

export interface Availability{
  id:string
  userId:string     
  date:string 
  times:string[]     
  createdAt:Date
  updatedAt:Date
}