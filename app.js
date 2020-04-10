require('dotenv').config()
const express = require('express')
const app = express()
const PORT = process.env.PORT
const cors = require('cors')
const router = require('./router/index.js')
const errorHandler = require('./middlewares/errorHandler.js')
const http = require('http').createServer(app)
const io = require('socket.io')(http)

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(router)
app.use(errorHandler)
io.on('connection', function(socket) {
    socket.broadcast.emit('markicabs')
    console.log(`new user has connected`)
    io.emit('connect', 'connected')
    socket.on('create', () => {
        console.log(`listen create`)
        io.emit('createMention')
    })
    socket.on('updatePut', () => {
        io.emit('updatePutMention')
    })
    socket.on('updatePatch', () => {
        io.emit('updatePatchMention')
    })
    socket.on('delete', () => {
        io.emit('deleteMention')
    })

    socket.on('disconnect', () => {
        console.log(`user dc`)
    })
})

http.listen(PORT, () => {
    console.log(`listening to port ${PORT}`)
})