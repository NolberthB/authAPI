import mongoose from 'mongoose'

import { ConnectionError } from '../errors/index.js'
import { MONGO_URI } from '../configs/env.js'

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI)
    console.log('Connected to MongoDB ...')
  } catch (error) {
    throw new ConnectionError('Error connection to MongoDB database')
  }
}

export default connectDB
