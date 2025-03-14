import { PrismaClient } from "@prisma/client";
import {User,Booking,Availability} from '../types/userTypes'
const prisma = new PrismaClient()

export const getAvailabilitiesService = async (): Promise<Partial<Availability>[]>=>{
  const availabilities = await prisma.availability.findMany({
    select:{
      date:true,
      times:true
    }
  })
  return availabilities || []
}