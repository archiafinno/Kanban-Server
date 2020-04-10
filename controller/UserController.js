const models = require('../models')
const { generateToken } = require('../helper/jwt.js')
const { decryptPassword } = require('../helper/bcrypt.js')
const { OAuth2Client } = require('google-auth-library');

class UserController {
    static read(req, res, next) {
        console.log(`masuk ke controller`)
        return models.User.findAll({ where: { id: req.loggedUserId } })
            .then(result => {
                let weatherData = req.weatherData
                console.log(`ini result User cont weather data`)
                console.log(weatherData)
                return res.status(200).json({
                    Users: result,
                    weather: weatherData
                })
            })
            .catch(err => {
                return next(err)
            })
    }

    static register(req, res, next) {
        console.log(`masuk ke controller register`)
        const { email, password } = req.body
        const newAccount = { email, password }
        console.log(req.body)
        console.log(email, password)
        return models.User.create(newAccount)
            .then(result => {
                const payload = {
                    id: result.id,
                    email: result.email
                }
                let token = generateToken(payload)
                return res.status(201).json({
                    id: result.id,
                    email: result.email,
                    token: token
                })
            })
            .catch(err => {
                return next(err)
            })
    }

    static login(req, res, next) {
        console.log(`masuk login`)
        const { email, password } = req.body
        const data = { email, password }
        console.log(data)
        return models.User.findOne({ where: { email: email } })
            .then(result => {
                if (result) {
                    let compare = decryptPassword(password, result.password)
                    if (compare) {
                        let payload = {
                                id: result.id,
                                email
                            }
                            // console.log(payload)
                        let token = generateToken(payload)
                        return res.status(200).json({
                            id: result.id,
                            email: email,
                            token: token
                        })
                    } else {
                        return next({
                            name: `BadRequest`,
                            errors: [{ message: `Invalid email/password` }]
                        })
                    }
                } else {
                    return next({
                        name: `BadRequest`,
                        errors: [{ message: `Invalid email/password` }]
                    })
                }
            })
            .catch(err => {
                return next(err)
            })
    }

    static googleLogin(req, res, next) {
        const client = new OAuth2Client(process.env.CLIENT_ID);
        let email;
        // nge decode token yang dikasih gmail
        client.verifyIdToken({
                idToken: req.body.token,
                audience: process.env.CLIENT_ID
            })
            .then(ticket => {
                console.log(`=======HASIL DECODE TOKEN========`)
                console.log(ticket)
                console.log(`=======DOWN========`)
                    // ngambil email dari hasil decode, utk dicek di db kita, email user udh terdaftar apa belum
                email = ticket.getPayload().email
                return models.User.findOne({ where: { email: email } })
                    .then(result => {
                        if (result) {
                            return result
                        } else {
                            return models.User.create({ email, password: 'userGoogle' })
                        }
                    })
                    .then(result => {
                        let payload = {
                            id: result.id,
                            email: result.email
                        }
                        let token = generateToken(payload)
                        return res.status(201).json({
                            id: result.id,
                            email: result.email,
                            token: token
                        })
                    })
                    .catch(err => {
                        return next(err)
                    })

            })
    }
}

module.exports = UserController