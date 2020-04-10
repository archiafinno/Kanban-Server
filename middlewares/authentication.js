const { decodeToken } = require('../helper/jwt')
const models = require('../models')

const authentication = (req, res, next) => {
    try {
        console.log(`masuk auth`)
        let decode = decodeToken(req.headers.token)
        console.log(decode)
        return models.User.findOne({ where: { id: decode.id } })
            .then(result => {
                if (result) {
                    req.loggedUserId = result.id
                    return next()
                } else {
                    return next({
                        name: `NotFound`,
                        errors: [{ message: `User not found` }]
                    })
                }
            })
            .catch(err => {
                return next({
                    name: `Unauthenticated`,
                    errors: [{ message: `User unauthenticated` }]
                })
            })
    } catch (err) {
        if (err.name !== `InternalServerError`) {
            return next(err)
        } else {
            return next({
                name: `InternalServerError`,
                errors: [{ message: `InternalServerError` }]
            })
        }
    }
}


module.exports = authentication