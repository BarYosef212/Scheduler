import { Request, Response } from "express";
import * as service from "../services/userServices";
import { USER_MESSAGE, GENERAL_MESSAGES } from "./messages";
import HTTP from "../constants/status";
import sendErrorResponse from "../utils/errorHandler";

export const userLogin = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendErrorResponse(res, HTTP.StatusCodes.BAD_REQUEST, `Error in userLogin controller: ${GENERAL_MESSAGES.PARAMETERS_NOT_PROVIDED}`);
    }

    const token = await service.userLogin(email, password);
    if (!token) {
      return sendErrorResponse(res, HTTP.StatusCodes.BAD_REQUEST, `Error in userLogin controller: ${USER_MESSAGE.INVALID_DETAILS}`);
    }

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 3600000,
    });

    return res.json({ message: USER_MESSAGE.LOGIN });
  } catch (error) {
    return sendErrorResponse(res, HTTP.StatusCodes.INTERNAL_SERVER_ERROR, `Error in userLogin controller: ${GENERAL_MESSAGES.UNKNOWN_ERROR}`);
  }
};

export const userLogout = async (req: Request, res: Response): Promise<Response> => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });
    return res.json({ message: USER_MESSAGE.LOGOUT });
  } catch (error) {
    return sendErrorResponse(res, HTTP.StatusCodes.INTERNAL_SERVER_ERROR, `Error in userLogout controller: ${GENERAL_MESSAGES.UNKNOWN_ERROR}`);
  }
};

export const userRegister = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, userName, password } = req.body;
    if (!email || !userName || !password) {
      return sendErrorResponse(res, HTTP.StatusCodes.BAD_REQUEST, `Error in userRegister controller: ${GENERAL_MESSAGES.PARAMETERS_NOT_PROVIDED}`);
    }

    await service.register(userName, email, password);
    return res.json({ message: USER_MESSAGE.REGISTER });
  } catch (error) {
    return sendErrorResponse(res, HTTP.StatusCodes.INTERNAL_SERVER_ERROR, `Error in userRegister controller: ${GENERAL_MESSAGES.UNKNOWN_ERROR}`);
  }
};

export const getUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { userId } = req.query as { userId: string };
    if (!userId) {
      return sendErrorResponse(res, HTTP.StatusCodes.BAD_REQUEST, `Error in getUser controller: ${GENERAL_MESSAGES.PARAMETERS_NOT_PROVIDED}`);
    }

    const user = await service.getUser(userId);
    if (!user) {
      return sendErrorResponse(res, HTTP.StatusCodes.NOT_FOUND, `Error in getUser controller: ${USER_MESSAGE.NOT_FOUND}`);
    }

    const { password, ...rest } = user;

    return res.json({
      user: rest,
    });
  } catch (error) {
    return sendErrorResponse(res, HTTP.StatusCodes.INTERNAL_SERVER_ERROR, `Error in getUser controller: ${GENERAL_MESSAGES.UNKNOWN_ERROR}`);
  }
};

export const updateUser = async (req: Request, res: Response): Promise<Response> => {
  const { data } = req.body;
  const { userId } = req.params;

  try {
    const updated = await service.updateUser(userId, data);
    if (!updated) {
      return sendErrorResponse(res, HTTP.StatusCodes.BAD_REQUEST, `Error in updateUser controller: ${USER_MESSAGE.UPDATE_FAILED}`);
    }
    return res.json({ message: GENERAL_MESSAGES.SUCCESS });
  } catch (error) {
    return sendErrorResponse(res, HTTP.StatusCodes.INTERNAL_SERVER_ERROR, `Error in updateUser controller: ${GENERAL_MESSAGES.UNKNOWN_ERROR}`);
  }
};
