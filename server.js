// const restify = require('restify')
// const compression = require('compression')
// const helmet = require('helmet')
// const session = require('express-session')
// const routes = require('./api')
// const { log, middleware: loggerMiddleware } = require('./services/logger')
// const { PORT, SESSION_SECRET } = require('./config')
// // const { NODE_ENV } = process.env

// /**
//  * Create the server
//  */
// const server = restify.createServer({
//   name: 'DemocracyOS-api',
//   version: '1.0.0',
//   log: log
// })

// server.use(restify.plugins.acceptParser(server.acceptable))
// server.use(restify.plugins.queryParser()) // Parse query
// server.use(restify.plugins.bodyParser()) // Parse body
// server.use(helmet()) // Enable HTTP Security headers and others security measures
// server.use(compression()) // Enable compression (gzip and others..)
// server.use(session({
//   secret: SESSION_SECRET,
//   resave: false,
//   saveUninitialized: true,
//   store: mongoStore
// }))

// server.use(keycloak.middleware({
//   logout: '/logout',
//   admin: '/callback'
// }))

// routes.applyRoutes(server) // Add restify-router

// /**
//  * Error handling
//  */
// server.on('NotFound', function (req, res, err, callback) {
//   // this will get fired first, as it's the most relevant listener
//   log.error('Not found!') // Logs the error
//   return callback()
// })

// /**
//  * Everything set?
//  * Go server go!
//  */
// server.listen(PORT, function () {
//   // handle errors
//   const db = mongoose.connection

//   db.on('error', (err) => {
//     log.error('Mongoose default connection error: ' + err)
//   })

//   db.on('disconnected', () => {
//     log.debug('Mongoose default connection disconnected')
//   })

//   // db.on('error', (err) => {
//   //   if (err.message.code === 'ETIMEDOUT') {
//   //     console.log('Mongoose default connection error: '  + err)
//   //   }
//   // })

//   db.once('open', () => {
//     log.info('%s listening at %s', server.name, server.url)
//   })
// })

const express = require('express')
const compression = require('compression')
const helmet = require('helmet')
const session = require('express-session')
const expressWinston = require('express-winston')
const mongoose = require('./services/mongoose')
const keycloak = require('./services/auth')
const mongoStore = require('./services/sessions')
// const { setup } = require('../services/setup')
const { PORT, SESSION_SECRET, ROOT_URL } = require('./config')
const log = require('./services/logger')
const { NODE_ENV } = process.env
const loggerMiddleware = expressWinston.logger({ winstonInstance: log })

module.exports = (async () => {
  try {
    const server = express()

    // Apply middlewares
    server.use(helmet())
    server.use(compression())
    server.use(express.json())
    server.use(express.urlencoded({ extended: true }))
    server.use(loggerMiddleware)
    server.use(session({
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
      store: mongoStore
    }))

    server.use(keycloak.middleware({ logout: '/logout' }))

    // Express App
    // Apply setup service
    // server.all('/', setup)

    // Apply API routes
    server.use('/', require('./api'))

    // Admin page
    // expressApp.get('/admin', (req, res) => {
    //   if (!req.user || req.user.role !== 'admin') {
    //     app.render(req, res, '/404')
    //   } else {
    //     app.render(req, res, '/admin')
    //   }
    // })

    // expressApp.get('/admin/*', (req, res) => {
    //   if (!req.user || req.user.role !== 'admin') {
    //     app.render(req, res, '/404')
    //   } else {
    //     app.render(req, res, '/admin')
    //   }
    // })

    // expressApp.all('*', (req, res) => {
    //   let nextRequestHandler = app.getRequestHandler()
    //   return nextRequestHandler(req, res)
    // })

    return server.listen(PORT, (err) => {
      if (err) {
        throw err
      }
      log.info('> Ready on http://localhost:' + PORT + ' [' + NODE_ENV + ']')
    })
  } catch (err) {
    log.error('An error occurred, unable to start the server')
    log.error(err)
  }
})()

// ===============================================
// do not delete, we might need it later
// ===============================================

// const express = require('express')
// const session = require('express-session')
// const MongoStore = require('connect-mongo')(session)
// const authFunctions = require('../users/auth/functions')
// const authProviders = require('../users/auth/providers')
// const { setup } = require('../services/setup')
// const { middleware: loggerMiddleware, log } = require('./logger')
// const mongoose = require('./mongoose')

// const app = next({
//   dev: NODE_ENV !== 'production',
//   quiet: NODE_ENV === 'test'
// })

// module.exports = (async () => {
//   try {
//     await app.prepare()

//     const server = express()

//     // Apply middlewares
//     server.use(helmet())
//     server.use(compression())
//     server.use(express.json())
//     server.use(express.urlencoded({ extended: true }))
//     server.use(passport.initialize())
//     server.use(passport.session())
//     // server.use(loggerMiddleware)

//     // Init authentication and next server
//     const nextAuthOptions = await nextAuth(app, {
//       sessionSecret: SESSION_SECRET,
//       providers: authProviders(),
//       expressApp: server,
//       functions: authFunctions,
//       serverUrl: ROOT_URL,
//       expressSession: session,
//       sessionStore: new MongoStore({
//         mongooseConnection: mongoose.connection,
//         collection: 'sessions',
//         stringify: false
//       })
//     })
//     // Express App
//     const expressApp = nextAuthOptions.expressApp
//     // Apply setup service
//     expressApp.all('/', setup)

//     // Apply API routes
//     expressApp.use('/api/v1.0', require('./api'))

//     // Admin page
//     expressApp.get('/admin', (req, res) => {
//       if (!req.user || req.user.role !== 'admin') {
//         app.render(req, res, '/404')
//       } else {
//         app.render(req, res, '/admin')
//       }
//     })

//     expressApp.get('/admin/*', (req, res) => {
//       if (!req.user || req.user.role !== 'admin') {
//         app.render(req, res, '/404')
//       } else {
//         app.render(req, res, '/admin')
//       }
//     })

//     expressApp.all('*', (req, res) => {
//       let nextRequestHandler = app.getRequestHandler()
//       return nextRequestHandler(req, res)
//     })

//     return expressApp.listen(PORT, (err) => {
//       if (err) {
//         throw err
//       }
//       console.log('> Ready on http://localhost:' + PORT + ' [' + NODE_ENV + ']')
//     })
//   } catch (err) {
//     log.error('An error occurred, unable to start the server')
//     log.error(err)
//   }
// })()
