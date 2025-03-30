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
      sameSite: 'strict',
      maxAge: 3600000,
    })

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
      secure: false,
      sameSite: 'strict'
    })
    return res.json({ message: USER_MESSAGE.LOGOUT })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: GENERAL_MESSAGES.UNKNOWN_ERROR })
  }
}

export const getUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.query as { id: string };
    if (!id) {
      return res.status(400).json({
        message: GENERAL_MESSAGES.PARAMETERS_NOT_PROVIDED
      })
    }
    const user = await service.getUser(id)

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

// export const getActivityHoursForUser = async(req:Request,res:Response):Promise<void>=>{
//   const {email} = req.query
//   if(!email || typeof email!=='string')return
//   const user = await getUser(email)
//   if(user){
//     res.json({
//       start:user.workHoursStart,
//       end:user.workHoursEnd,
//       interval:user.appointmentIntervalInMinutes
//     })
//   }
//   else{
//     res.status(401).json({
//       message:"Error loading activity hours"
//     })
//   }
// }

// export const getBookingsOfUser = async(req:Request,res:Response):Promise<void>=>{
//   const { email } = req.query
//   if (!email || typeof email !== 'string') return
//   const bookings = await getBookingsOfUserService(email)
//   if (bookings) {
//     res.json({
//       bookings: bookings
//     })
//   }
//   else {
//     res.status(401).json({
//       message: "Error loading user's bookings"
//     })
//   }
// }