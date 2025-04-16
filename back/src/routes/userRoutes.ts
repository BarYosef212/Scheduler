import express, { Request, Response } from 'express'
import * as controllers from '../controllers/userController'
import {isAuthenticated } from '../middleware/auth'
import { checkToken } from '../middleware/auth'
import * as googleServices from '../services/googleCalendar';
const router = express.Router()

router.get('/auth/google', (req, res) => {
  googleServices.redirectToGoogleAuth(req, res);
});

router.get('/auth/google/callback', async (req, res) => {
  googleServices.handleGoogleAuthCallback(req,res)
});


/**
 * @swagger
 * /api/getUser:
 *   get:
 *     tags:
 *       - User
 *     summary: Retrieve user details
 *     description: Fetches the details of a user by ID.
 *     parameters:
 *       - in: query
 *         name: userId
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


router.post('/userRegister',(req:Request,res:Response)=>{
  controllers.userRegister(req,res)
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


/**
 * @swagger
 * /api/updateUser/{userId}:
 *   put:
 *     tags:
 *       - User
 *     summary: Update user details
 *     description: Updates the details of a user by ID.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The user's name.
 *               email:
 *                 type: string
 *                 description: The user's email address.
 *             required:
 *               - name
 *               - email
 *     responses:
 *       200:
 *         description: User details updated successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 */
router.put('/updateUser/:userId', checkToken,(req:Request,res:Response)=>{
  controllers.updateUser(req,res)
})

export default router
