import { Request, Response } from "express";
import * as service from "../services/userServices";
import { USER_MESSAGE, GENERAL_MESSAGES } from "./messages";


export const userLogin = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password } = req.body

    if (!email || !password) return res.status(400).json({ message: GENERAL_MESSAGES.PARAMETERS_NOT_PROVIDED })

    const token = await service.userLogin(email, password)
    if (!token) return res.status(400).json({ message: USER_MESSAGE.INVALID_DETAILS })
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 3600000,
    });

    return res.json({ message: USER_MESSAGE.LOGIN })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: GENERAL_MESSAGES.UNKNOWN_ERROR })
  }
}

export const userLogout = async (req: Request, res: Response): Promise<Response> => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: true,
      sameSite: 'none'
    })
    return res.json({ message: USER_MESSAGE.LOGOUT })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: GENERAL_MESSAGES.UNKNOWN_ERROR })
  }
}

export const getUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { userId } = req.query as { userId: string };
    if (!userId) {
      return res.status(400).json({
        message: GENERAL_MESSAGES.PARAMETERS_NOT_PROVIDED
      })
    }
    const user = await service.getUser(userId)

    if (!user) {
      return res.status(404).json({
        message: USER_MESSAGE.NOT_FOUND
      })
    }
    return res.json({
      user
    })

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: GENERAL_MESSAGES.UNKNOWN_ERROR
    })
  }
}

export const updateUser = async (req: Request, res: Response): Promise<Response> => {
  const {data } = req.body
  const {userId} = req.params

  try {
    const updated = await service.updateUser(userId, data)
    if (!updated) return res.status(400).json({ message: USER_MESSAGE.UPDATE_FAILED })
    return res.json({ message: GENERAL_MESSAGES.SUCCESS })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: GENERAL_MESSAGES.UNKNOWN_ERROR })
  }
}