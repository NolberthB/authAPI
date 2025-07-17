// controllers/index.js
import { register } from './registerController.js'
import { login } from './loginController.js'
import { getAll } from './userController.js'

const controllers = {
  register,
  login,
  getAll
}

export default controllers
