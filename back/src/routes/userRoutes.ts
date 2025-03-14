import express, {Request,Response} from 'express'
import { getActivityHoursForUser,getBookingsOfUser } from '../controllers/userController'
import { getAvailabilities } from '../controllers/bookingController'
import { log } from 'console'

const router = express.Router()

router.get('/getActivityHoursForUser',(req:Request, res:Response)=>{
  getActivityHoursForUser(req,res)
})

router.get('/getBookingsOfUser',(req:Request,res:Response)=>{
  getBookingsOfUser(req,res)
})

router.get('/getAvailabilities', (req: Request, res: Response) => {
  getAvailabilities(req, res)
})

export default router