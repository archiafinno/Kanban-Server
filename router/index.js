const router = require('express').Router()
const tasks = require('./TaskRouter.js')
const users = require('./UserRouter.js')

router.use('/tasks', tasks)
router.use('/users', users)

module.exports = router