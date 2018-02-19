import * as http from 'http'
import * as debug from 'debug'
import * as path from 'path'
import * as express from 'express'
import * as logger from 'morgan'
import * as bodyParser from 'body-parser'

import HeroRouter from './routes/HeroRouter'
// import App from './App'

class App {

    // ref to Express instance
    public express: express.Application

    //Run configuration methods on the Express instance.
    constructor() {
        this.express = express()
        this.middleware()
        this.routes()
    }

    // Configure Express middleware.
    private middleware(): void {
        this.express.use(logger('dev'));
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }))
    }

    // Configure API endpoints.
    private routes(): void {
        /* This is just to get up and running, and to make sure what we've got is
         * working so far. This function will change when we start to add more
         * API endpoints */
        let router = express.Router()
        // placeholder route handler
        router.get('/', (req, res, next) => {
          res.json({
            message: 'Hello World!'
          });
        });
        this.express.use('/', router);
        this.express.use('/api/v1/heroes', HeroRouter)
    }

}

const app = new App().express

debug('ts-express:server')

const normalizePort = (val: number|string): number|string|boolean => {
    let port: number = (typeof val === 'string') ? parseInt(val, 10) : val
    
    if (isNaN(port)) {
        // named pipe
        return val
    }
    if (port >= 0) {
        // port number
        return port
    }

    return false
}

//Get port from environment and store in Express.
const port = normalizePort(process.env.PORT || 3000)
app.set('port', port)

//Create HTTP server.
const server = http.createServer(app)

//Listen on provided port, on all network interfaces.
server.listen(port)

//Event listener for HTTP server "error" event.
const onError = (error: NodeJS.ErrnoException): void => {
    if (error.syscall !== 'listen') {
        throw error
    }

    let bind = (typeof port === 'string') ? 'Pipe ' + port : 'Port ' + port
    
    // handle specific listen errors with friendly messages
    switch(error.code) {
        case 'EACCES':
            console.error(`${bind} requires elevated privileges`)
            process.exit(1)
            break
        case 'EADDRINUSE':
            console.error(`${bind} is already in use`)
            process.exit(1)
            break
        default:
            throw error
    }
}

//Event listener for HTTP server "listening" event.
const onListening = (): void => {
    let addr = server.address()
    let bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`
    console.log(`Listening on ${bind}`)
}

server.on('error', onError)
server.on('listening', onListening)