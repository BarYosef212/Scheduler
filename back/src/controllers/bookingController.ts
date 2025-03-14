import { Request, Response } from "express";
import { getAvailabilitiesService } from '../services/bookingServices'
import { DatePicker } from "@mui/x-date-pickers";

export const getAvailabilities= async(req:Request,res:Response):Promise<void>=>{
  const availabilities = await getAvailabilitiesService()
  res.json({
    availabilities
  })
}