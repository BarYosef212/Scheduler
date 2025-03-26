import { Request, Response } from "express";
import { PrismaClient, Prisma } from "@prisma/client";
import * as service from '../services/availabilitiesServices'
const prisma = new PrismaClient()


export const getAvailabilities = async (req: Request, res: Response): Promise<void> => {
  try {
    const availabilities = await service.getAvailabilitiesService()
    res.json({
      availabilities
    })
  } catch (error) {
    console.error("error with getAvailabilities controller")
    res.status(500).json({
      message: "error occurred, please try again later"
    })
  }
}


export const createAvailabilities = async (req: Request, res: Response):Promise<void> => {
  try {
    const { times, date, userId }: { times: string[], date: Date, userId: string } = req.body

    if (!times || !date || !userId || !(times.length > 0)) {
      res.status(400).json({
        message: "Error with parameters provided"
      })
      return
    }
    
    const overlaps = await service.checkIfAvailabilitiesOverlapping(date, times)

    if (overlaps) {
      res.status(400).json({
        message: "קיימים התנגשויות בין תורים קיימים"
      })
      return
    }
    const created = await service.createAvailabilities(times,date,userId)
    if(created){
      res.sendStatus(200)
      return
    }
    else{
      res.status(400).json({
        message: "error occurred, please try again later"
      })
      return
    }
    
  } catch (error) {
    console.error("error with createAvailabilities controller")
    res.status(500).json({
      message: "error occurred, please try again later"
    })
  }
}