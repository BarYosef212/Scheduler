import express, { NextFunction, Request, Response } from 'express'
import * as controllers from '../controllers/userController'
import {isAuthenticated } from '../middleware/auth'

const router = express.Router()

router.get('/getUser', (req:Request, res:Response) => {
  controllers.getUser(req, res)
})

router.post('/login',(req:Request,res:Response)=>{
  controllers.userLogin(req,res)
})

router.post('/logout', (req: Request, res: Response) => {
  controllers.userLogout(req, res)
})


router.get('/protected',(req:Request,res:Response)=>{
  isAuthenticated(req,res)
})

export default router
