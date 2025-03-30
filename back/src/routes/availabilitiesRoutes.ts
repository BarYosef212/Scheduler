import express, { Request, Response } from 'express'
import * as controllers from '../controllers/availabilitiesController'
import { checkToken } from '../middleware/auth'

const router = express.Router()


router.get('/getAvailabilities', (req: Request, res: Response) => {
  controllers.getAvailabilities(req, res)
})

router.post('/createAvailabilities', checkToken, (req: Request, res: Response) => {
  controllers.createAvailabilities(req, res)
})

router.delete('/deleteAvailabilities', checkToken,(req:Request,res:Response)=>{
  controllers.deleteTimesFromAvailability(req,res)
})

export default router
