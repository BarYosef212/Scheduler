import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import * as service from '../services/availabilitiesServices'
import { AVAILABILITY_MESSAGES, GENERAL_MESSAGES } from "./messages";
const prisma = new PrismaClient()


export const getAvailabilities = async (req: Request, res: Response): Promise<Response> => {
  try {
    const{userId} = req.params
    const availabilities = await service.getAvailabilities(userId)
    if (availabilities) {
      return res.json({ availabilities })
    }
    else return res.status(400).json({ message: AVAILABILITY_MESSAGES.FAIL_GET_AVAILABILITIES })
  } catch (error) {
    console.error("error with getAvailabilities controller: ", error)
    return res.status(500).json({
      message: GENERAL_MESSAGES.UNKNOWN_ERROR
    })
  }
}


export const createAvailabilities = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { times, date }: { times: string[], date: Date, userId: string } = req.body
    const {userId} = req.params

    if (!times || !date || !userId || !(times.length > 0)) {
      return res.status(400).json({
        message: GENERAL_MESSAGES.PARAMETERS_NOT_PROVIDED
      })
    }

    const overlaps = await service.checkIfAvailabilitiesOverlapping(date, times,userId)

    if (overlaps) return res.status(400).json({ message: AVAILABILITY_MESSAGES.OVERLAP_AVAILABILITIES })


    const created = await service.createAvailabilities(times, date, userId)

    if (created) return res.sendStatus(200)
    else {
      return res.status(400).json({
        message: GENERAL_MESSAGES.API_ERROR
      })
    }

  } catch (error) {
    console.error("error with createAvailabilities controller")
    return res.status(500).json({
      message: GENERAL_MESSAGES.UNKNOWN_ERROR
    })
  }
}


export const deleteTimesFromAvailability = async (req: Request, res: Response) => {
  const { date, startTime, endTime } = req.query
  const {userId} = req.params
  if (!date || !startTime || !endTime) {
    return res.status(400).json({ message: GENERAL_MESSAGES.PARAMETERS_NOT_PROVIDED});
  }
  const parsedDate = new Date(date as string);
  const parsedStartTime = new Date(startTime as string);
  const parsedEndTime = new Date(endTime as string);

  if (isNaN(parsedDate.getTime()) || isNaN(parsedStartTime.getTime()) || isNaN(parsedEndTime.getTime())) {
    return res.status(400).json({ message: AVAILABILITY_MESSAGES.FAIL_REMOVE_TIME });
  }

  try {
    await service.deleteTimesFromAvailability(parsedDate, parsedStartTime, parsedEndTime,userId);
    res.json({ message: AVAILABILITY_MESSAGES.REMOVE_SUCCESS });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
