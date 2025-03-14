import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import userRoutes from './src/routes/userRoutes'
import bodyParser from 'body-parser'
dotenv.config()


const app = express()
const PORT = process.env.PORT

app.use(bodyParser.json());
app.use(express.json());

app.use(cors({
  origin:"http://localhost:5173",
}))

app.use('/api',userRoutes)

app.listen(PORT,()=>{
  console.log(`Server connected on http://localhost:${PORT}/`)
})




