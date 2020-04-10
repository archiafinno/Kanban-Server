const router = require('express').Router()
const TaskController = require('../controller/TaskController.js')
const authentication = require('../middlewares/authentication.js')
const authorization = require('../middlewares/authorization.js')

router.use(authentication)
router.get('/', TaskController.findAll)
router.post('/', TaskController.create)
router.put('/:id', authorization, TaskController.update)
router.patch('/:id', authorization, TaskController.updateOne)
router.delete('/:id', authorization, TaskController.delete)

module.exports = router