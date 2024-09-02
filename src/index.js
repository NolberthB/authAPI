import 'dotenv/config'

import express from 'express'

import { PORT } from './configs/env.js'
import connectDB from './configs/mongoDB.js'

const app = express()

connectDB()

app.get('/', (req, res) => {
  res.send({
    message: 'Hello API Auth Service'
  })
})

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))
