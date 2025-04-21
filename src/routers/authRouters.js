import { Router } from 'express'
import controllers from '../controller/index.js'

import { validateUser } from '../validations/validateUser.js'

const router = Router()

router.post('/login', controllers.login)
router.post('/register', validateUser, controllers.register)

export default router
