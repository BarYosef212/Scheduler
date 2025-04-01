import express, { Request, Response } from 'express'
import * as controllers from '../controllers/availabilitiesController'
import { checkToken } from '../middleware/auth'

const router = express.Router()

/**
 * @swagger
 * /api/getAvailabilities/{userId}:
 *   get:
 *     summary: Retrieve availabilities for a user
 *     tags: [Availability]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: Successfully retrieved availabilities
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.get('/getAvailabilities/:userId', (req: Request, res: Response) => {
  controllers.getAvailabilities(req, res)
})

/**
 * @swagger
 * /api/createAvailabilities/{userId}:
 *   post:
 *     summary: Create availabilities for a user
 *     tags: [Availability]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Availability data
 *     responses:
 *       201:
 *         description: Successfully created availabilities
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/createAvailabilities/:userId', checkToken, (req: Request, res: Response) => {
  controllers.createAvailabilities(req, res)
})

/**
 * @swagger
 * /api/deleteAvailabilities/{userId}:
 *   delete:
 *     summary: Delete availabilities for a user
 *     tags: [Availability]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: Successfully deleted availabilities
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.delete('/deleteAvailabilities/:userId', checkToken, (req: Request, res: Response) => {
  controllers.deleteTimesFromAvailability(req, res)
})

export default router
