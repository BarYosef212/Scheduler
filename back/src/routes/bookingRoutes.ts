import express, { Request, Response } from 'express'
import * as controllers from '../controllers/bookingController'
import { checkToken } from '../middleware/auth'

const router = express.Router()


/**
 * @swagger
 * /api/scheduleBooking/{userId}:
 *   post:
 *     tags:
 *       - Booking
 *     summary: Schedule a new booking for a user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: Booking scheduled successfully
 */
router.post('/scheduleBooking/:userId', (req: Request, res: Response) => {
  controllers.scheduleBooking(req, res)
})

/**
 * @swagger
 * /api/getBookingsById/{userId}:
 *   get:
 *     tags:
 *       - Booking
 *     summary: Get confirmed bookings for a user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of confirmed bookings
 */
router.get('/getConfirmedBookings/:userId', (req: Request, res: Response) => {
  controllers.getBookingsById(req, res)
})


router.post('/cancelAllBookingsOnDate/:userId', (req: Request, res: Response) => {
  controllers.cancelAllBookingsOnDate(req, res)
})

/**
 * @swagger
 * /api/cancelBooking:
 *   post:
 *     tags:
 *       - Booking
 *     summary: Cancel an existing booking
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Booking canceled successfully
 */
router.post('/cancelBooking', checkToken, (req: Request, res: Response) => {
  controllers.cancelBooking(req, res)
})

/**
 * @swagger
 * /api/updateBooking:
 *   put:
 *     tags:
 *       - Booking
 *     summary: Update an existing booking
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Booking updated successfully
 */
router.put('/updateBooking', checkToken, (req: Request, res: Response) => {
  controllers.updateBooking(req, res)
})




export default router