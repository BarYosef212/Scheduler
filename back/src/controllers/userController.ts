import { Request,Response } from "express";
import { getUser, getBookingsOfUserService } from "../services/userServices";

export const getActivityHoursForUser = async(req:Request,res:Response):Promise<void>=>{
  const {email} = req.query
  if(!email || typeof email!=='string')return
  const user = await getUser(email)
  if(user){
    res.json({
      start:user.workHoursStart,
      end:user.workHoursEnd,
      interval:user.appointmentIntervalInMinutes
    })
  }
  else{
    res.status(401).json({
      message:"Error loading activity hours"
    })
  }
}

export const getBookingsOfUser = async(req:Request,res:Response):Promise<void>=>{
  const { email } = req.query
  if (!email || typeof email !== 'string') return
  const bookings = await getBookingsOfUserService(email)
  if (bookings) {
    res.json({
      bookings: bookings
    })
  }
  else {
    res.status(401).json({
      message: "Error loading user's bookings"
    })
  }
}