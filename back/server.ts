import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import bookingRoutes from './src/routes/bookingRoutes'
import availabilitiesRoutes from './src/routes/availabilitiesRoutes'
import userRoutes from './src/routes/userRoutes'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import swaggerUi from 'swagger-ui-express';
import swaggerDocs from './src/config/swagger'
import path from 'path';
import logger from './src/config/logger'

dotenv.config()

const app = express()
const PORT = process.env.PORT

app.use(bodyParser.json());
app.use(cookieParser())
app.use(express.json());


app.use(cors({
  origin: ["http://142.93.162.193:5173", "http://localhost:5173", "https://scheduletoday.me","www.scheduletoday.me"],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use('/api', bookingRoutes)
app.use('/api', availabilitiesRoutes)
app.use('/api', userRoutes)

app.use(express.static(path.join(__dirname, '..', 'front', 'dist')));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));



app.listen(PORT, () => {
  logger.info(`Server connected on https://localhost:${PORT}/`)
})





