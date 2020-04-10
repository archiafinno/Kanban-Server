const models = require('../models')

class TaskController {
    static findAll(req, res, next) {
        console.log(`masuk ke findALl`)
        return models.Task.findAll({
                order: [
                    ['id', 'ASC']
                ],
                where: { UserId: req.loggedUserId }
            })
            .then(result => {
                return res.status(200).json({
                    Tasks: result
                })
            })
            .catch(err => {
                return next(err)
            })
    }

    static create(req, res, next) {
        console.log(`----masuk ke create----`)
        return models.Task.create({
                title: req.body.title,
                description: req.body.description,
                status: req.body.status,
                UserId: req.loggedUserId
            })
            .then(result => {
                return res.status(201).json({
                    message: `successfully added new task to tasks list`,
                    Task: result
                })
            })
            .catch(err => {
                return next(err)
            })
    }

    static update(req, res, next) {
        console.log(`masuk ke update`)
        let param = req.params.id
        return models.Task.update({
                title: req.body.title,
                description: req.body.description,
                status: req.body.status
            }, { where: { id: param } })
            .then(result => {
                console.log(result)
                return res.status(201).json({
                    message: `successfully updated a task from your tasks list`
                })
            })
            .catch(err => {
                return next(err)
            })
    }

    static delete(req, res, next) {
        console.log(`masuk delete`)
        let param = req.params.id
        return models.Task.destroy({ where: { id: param } })
            .then(result => {
                return res.status(200).json({
                    message: `successfully deleted a task from tasks list`
                })
            })
            .catch(err => {
                return next(err)
            })
    }

    static updateOne(req, res, next) {
        console.log('masuk update one')
        const { id, status } = req.body
        console.log(id, status)
        return models.Task.update({ status: status }, { where: { id: id } })
            .then(updateData => {
                return res.status(201).json(updateData)
            })
            .catch(err => {
                return next(err)
            })
    }

}

module.exports = TaskController