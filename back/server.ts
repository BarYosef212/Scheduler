import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import bookingRoutes from './src/routes/bookingRoutes'
import availabilitiesRoutes from './src/routes/availabilitiesRoutes'
import bodyParser from 'body-parser'
dotenv.config()


const app = express()
const PORT = process.env.PORT

app.use(bodyParser.json());
app.use(express.json());

app.use(cors({
  origin: "http://localhost:5173",
}))

app.use('/api', bookingRoutes)
app.use('/api', availabilitiesRoutes)


app.listen(PORT, () => {
  console.log(`Server connected on http://localhost:${PORT}/`)
})




