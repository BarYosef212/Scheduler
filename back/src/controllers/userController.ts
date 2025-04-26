import { Request, Response } from "express";
import * as service from "../services/userServices";
import { USER_MESSAGE, GENERAL_MESSAGES } from "../constants/messages";
import HTTP from "../constants/status";
import {AppError, catchFunc, sendErrorResponse} from "../utils/errorHandler";

export const userLogin = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password }: { email: string, password: string } = req.body;
    if (!email || !password) {
      throw new Error(GENERAL_MESSAGES.PARAMETERS_NOT_PROVIDED)
    }

    const token = await service.userLogin(email, password);
    if (!token) {
      throw new AppError(USER_MESSAGE.INVALID_DETAILS)
    }

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 3600000,
    });

    return res.json({ message: USER_MESSAGE.LOGIN });
  } catch (error: any) {
      return catchFunc(error, res)
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
  } catch (error: any) {
    return catchFunc(error, res)
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
  } catch (error: any) {
    return catchFunc(error, res)
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
  } catch (error: any) {
    return catchFunc(error, res)
  }
};

export const updateUser = async (req: Request, res: Response): Promise<Response> => {
  const { data } = req.body;
  const { userId } = req.params;

  try {
    const updated = await service.updateUser(userId, data);
    if (!updated) {
      return sendErrorResponse(res, HTTP.StatusCodes.BAD_REQUEST, USER_MESSAGE.UPDATE_FAILED);
    }
    return res.json({ message: GENERAL_MESSAGES.SUCCESS });
  } catch (error: any) {
    return catchFunc(error, res)
  }
};
