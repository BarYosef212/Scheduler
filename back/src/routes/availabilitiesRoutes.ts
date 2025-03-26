import express, { Request, Response } from 'express'
import * as controllers from '../controllers/availabilitiesController'

const router = express.Router()


//admin
router.get('/getAvailabilities', (req: Request, res: Response) => {
  controllers.getAvailabilities(req, res)
})

router.post('/createAvailabilities', (req: Request, res: Response) => {
  controllers.createAvailabilities(req, res)
})

export default router
