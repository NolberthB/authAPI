// controllers/index.js
import { register } from './registerController.js'
import { login } from './loginController.js'
import { getProfile } from './profileController.js'

const controllers = {
  register,
  login,
  getProfile
}

export default controllers
