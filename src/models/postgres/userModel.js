import { DataTypes } from 'sequelize'
import { sequelize } from '../../db/postgresDB.js'

// Define the User model
// This model represents the users table in the database
export const User = sequelize.define(
  'User',
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }
)
