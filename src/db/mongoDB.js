import mongoose from 'mongoose'
import { envs } from '../configs/env.js'

import { ConnectionError } from '../errors/index.js'

const connectDB = async () => {
  try {
    await mongoose.connect(envs.MONGO_URI)
    console.log('Connected to MongoDB ...')
  } catch (error) {
    throw new ConnectionError('Error connection to MongoDB database')
  }
}

export default connectDB
