import express, {Request,Response} from 'express'
import * as controllers from '../controllers/bookingController'
import { checkToken } from '../middleware/auth'

const router = express.Router()


router.post('/scheduleBooking',(req:Request,res:Response)=>{
  controllers.scheduleBooking(req,res)
})


//admin
router.get('/getConfirmedBookings', checkToken, (req: Request, res: Response) => {
  controllers.getConfirmedBookings(req, res)
})

router.post('/cancelBooking', checkToken,(req:Request,res:Response)=>{
  controllers.cancelBooking(req,res)
})


router.put('/updateBooking', checkToken,(req:Request,res:Response)=>{
  controllers.updateBooking(req,res)
})



export default router