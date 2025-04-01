import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import bookingRoutes from './src/routes/bookingRoutes'
import availabilitiesRoutes from './src/routes/availabilitiesRoutes'
import userRoutes from './src/routes/userRoutes'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

dotenv.config()

const app = express()
const PORT = process.env.PORT

app.use(bodyParser.json());
app.use(cookieParser())
app.use(express.json());

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}))

app.use('/api', bookingRoutes)
app.use('/api', availabilitiesRoutes)
app.use('/api', userRoutes)


const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'My API',
      version: '1.0.0',
      description: 'API documentation using Swagger',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));



app.listen(PORT, () => {
  console.log(`Server connected on http://localhost:${PORT}/`)
})




