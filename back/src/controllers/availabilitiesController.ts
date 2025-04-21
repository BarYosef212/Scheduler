import { Request, Response } from "express";
import * as service from '../services/availabilitiesServices';
import { AVAILABILITY_MESSAGES, GENERAL_MESSAGES } from "../constants/messages";
import sendErrorResponse from "../utils/errorHandler";
import HTTP from "../constants/status";

export const getAvailabilities = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { userId } = req.params;
    const availabilities = await service.getAvailabilities(userId);
    if (availabilities) {
      return res.json({ availabilities });
    } else {
      return sendErrorResponse(
        res,
        HTTP.StatusCodes.BAD_REQUEST,
        `Error in getAvailabilities controller: ${AVAILABILITY_MESSAGES.FAIL_GET_AVAILABILITIES}`
      );
    }
  } catch (error) {
    return sendErrorResponse(
      res,
      HTTP.StatusCodes.INTERNAL_SERVER_ERROR,
      `Error in getAvailabilities controller: ${GENERAL_MESSAGES.UNKNOWN_ERROR}`
    );
  }
};

export const createAvailabilities = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { times, date }: { times: string[], date: Date, userId: string } = req.body;
    const { userId } = req.params;

    if (!times || !date || !userId || !(times.length > 0)) {
      return sendErrorResponse(
        res,
        HTTP.StatusCodes.BAD_REQUEST,
        GENERAL_MESSAGES.PARAMETERS_NOT_PROVIDED
      );
    }

    const overlaps = await service.checkIfAvailabilitiesOverlapping(date, times, userId);

    if (overlaps) {
      return sendErrorResponse(
        res,
        HTTP.StatusCodes.BAD_REQUEST,
        AVAILABILITY_MESSAGES.OVERLAP_AVAILABILITIES
      );
    }

    const created = await service.createAvailabilities(times, date, userId);

    if (created) {
      return res.json({ message: GENERAL_MESSAGES.SUCCESS });
    } else {
      return sendErrorResponse(
        res,
        HTTP.StatusCodes.BAD_REQUEST,
        GENERAL_MESSAGES.API_ERROR
      );
    }
  } catch (error) {
    return sendErrorResponse(
      res,
      HTTP.StatusCodes.INTERNAL_SERVER_ERROR,
      GENERAL_MESSAGES.UNKNOWN_ERROR
    );
  }
};

export const deleteTimesFromAvailability = async (req: Request, res: Response): Promise<Response> => {
  const { date, startTime, endTime } = req.query;
  const { userId } = req.params;

  if (!date || !startTime || !endTime) {
    return sendErrorResponse(
      res,
      HTTP.StatusCodes.BAD_REQUEST,
      GENERAL_MESSAGES.PARAMETERS_NOT_PROVIDED
    );
  }

  const parsedDate = new Date(date as string);
  const parsedStartTime = new Date(startTime as string);
  const parsedEndTime = new Date(endTime as string);

  if (isNaN(parsedDate.getTime()) || isNaN(parsedStartTime.getTime()) || isNaN(parsedEndTime.getTime())) {
    return sendErrorResponse(
      res,
      HTTP.StatusCodes.BAD_REQUEST,
      AVAILABILITY_MESSAGES.FAIL_REMOVE_TIME
    );
  }

  try {
    await service.deleteTimesFromAvailability(parsedDate, parsedStartTime, parsedEndTime, userId);
    return res.json({ message: AVAILABILITY_MESSAGES.REMOVE_SUCCESS });
  } catch (error) {
    return sendErrorResponse(
      res,
      HTTP.StatusCodes.INTERNAL_SERVER_ERROR,
      GENERAL_MESSAGES.UNKNOWN_ERROR
    );
  }
};
