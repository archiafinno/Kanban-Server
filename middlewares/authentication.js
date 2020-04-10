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
        return next(err)
    }
}


module.exports = authentication