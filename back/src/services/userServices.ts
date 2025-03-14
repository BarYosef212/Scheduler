import { PrismaClient } from "@prisma/client";
import {User,Booking} from '../types/userTypes'
const prisma = new PrismaClient()

export const getUser = async(email:string):Promise<User | null>=>{
  const user = await prisma.user.findUnique({
    where: {
      email: email, 
    },
  });
  return user
}

export const getBookingsOfUserService = async(email:string):Promise<Booking[]>=>{
  const user = await getUser(email)
  if(!user) return[]

  const bookings = await prisma.booking.findMany({
    where:{
      userId:user.id
    }
  })
  
  return bookings
}