import express, {Request,Response} from 'express'
import * as controllers from '../controllers/bookingController'

const router = express.Router()



router.get('/getBookings',(req:Request,res:Response)=>{
  controllers.getBookings(req,res)
})

router.post('/scheduleBooking',(req:Request,res:Response)=>{
  controllers.scheduleBooking(req,res)
})


//admin
router.post('/cancelBooking',(req:Request,res:Response)=>{
  controllers.cancelBooking(req,res)
})


router.put('/updateBooking',(req:Request,res:Response)=>{
  controllers.updateBooking(req,res)
})



export default router