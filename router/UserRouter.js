const router = require('express').Router()
const UserController = require('../controller/UserController.js')
const authentication = require('../middlewares/authentication.js')

router.get('/', authentication, UserController.read)
router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.post('/googleLogin', UserController.googleLogin)

module.exports = router