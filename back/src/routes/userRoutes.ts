import express, { NextFunction, Request, Response } from 'express'
import * as controllers from '../controllers/userController'
import {isAuthenticated } from '../middleware/auth'

const router = express.Router()
/**
 * @swagger
 * /api/getUser/{id}:
 *   get:
 *     tags:
 *       - User
 *     summary: Retrieve user details
 *     description: Fetches the details of a user by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user.
 *     responses:
 *       200:
 *         description: User details retrieved successfully.
 *       400:
 *         description: Bad request.
 */
router.get('/getUser', (req: Request, res: Response) => {
  controllers.getUser(req, res)
})

/**
 * @swagger
 * /api/login:
 *   post:
 *     tags:
 *       - User
 *     summary: User login
 *     description: Authenticates a user and starts a session.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email address.
 *               password:
 *                 type: string
 *                 description: The user's password.
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Login successful.
 *       401:
 *         description: Unauthorized.
 */
router.post('/login', (req: Request, res: Response) => {
  controllers.userLogin(req, res)
})

/**
 * @swagger
 * /api/logout:
 *   post:
 *     tags:
 *       - User
 *     summary: User logout
 *     description: Logs out the authenticated user and ends the session.
 *     responses:
 *       200:
 *         description: Logout successful.
 *       400:
 *         description: Bad request.
 */
router.post('/logout', (req: Request, res: Response) => {
  controllers.userLogout(req, res)
})

/**
 * @swagger
 * /api/auth/protected/{userId}:
 *   get:
 *     tags:
 *       - User
 *     summary: Access protected route
 *     description: Verifies if the user is authenticated to access the protected route.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user.
 *     responses:
 *       200:
 *         description: Access granted.
 *       403:
 *         description: Forbidden.
 */
router.get('/auth/protected/:userId', (req: Request, res: Response) => {
  isAuthenticated(req, res)
})

export default router
