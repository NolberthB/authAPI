import 'dotenv/config'

import express from 'express'

import { PORT } from './configs/env.js'
import connectDB from './configs/mongoDB.js'
import authRouters from './routers/authRouters.js'

const app = express()

connectDB() // <- Mongo connection

// middlewares
app.use(express.json())

// routers
app.use('/auth', authRouters)

app.get('/', (req, res) => {
  res.send({
    message: 'Hello API Auth Service'
  })
})

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))
