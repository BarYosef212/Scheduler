import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import bookingRoutes from './src/routes/bookingRoutes'
import availabilitiesRoutes from './src/routes/availabilitiesRoutes'
import userRoutes from './src/routes/userRoutes'

import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
dotenv.config()



const app = express()
const PORT = process.env.PORT

app.use(bodyParser.json());
app.use(cookieParser())
app.use(express.json());

app.use(cors({
  origin: "http://localhost:5173",
  credentials:true
}))

app.use('/api', bookingRoutes)
app.use('/api', availabilitiesRoutes)
app.use('/api', userRoutes)


app.listen(PORT, () => {
  console.log(`Server connected on http://localhost:${PORT}/`)
})




