const status = require('http-status')
const express = require('express')
const router = express.Router()
const User = require('../db-api/user')
const auth = require('../services/auth')
const middlewares = require('../services/middlewares')
// const errors = require('../services/errors')

router.route('/')
/**
 * @api {get} /users List users
 * @apiName getUsers
 * @apiGroup User
 */
  .get(
    async (req, res, next) => {
      try {
        const results = await User.list({}, {
          limit: req.query.limit,
          page: req.query.page
        })
        res.status(status.OK).json({
          results: results.docs,
          pagination: {
            count: results.total,
            page: results.page,
            limit: results.limit
          }
        })
      } catch (err) {
        next(err)
      }
    })
/**
 * @api {put} /users/:id Updates users info
 * @apiName putUser
 * @apiGroup User
 *
 * @apiParam {Number} id Users ID.
 */
  .put(
    auth.keycloak.protect(),
    async (req, res, next) => {
      try {
        const updatedUser = await User.update(req.session.user._id, req.body)
        res.status(status.OK).json(updatedUser)
      } catch (err) {
        next(err)
      }
    })

router.route('/:id')
/**
 * @api {get} /users/:id Gets a user
 * @apiName getUser
 * @apiGroup User
 *
 * @apiParam {Number} id Users ID.
 */
  .get(
    middlewares.checkId,
    async (req, res, next) => {
      try {
        // TODO
        const results = await User.get({ _id: req.params.id })
        res.status(status.OK).json(results)
      } catch (err) {
        next(err)
      }
    })
/**
 * @api {delete} /users/:id Delets a user
 * @apiName deleteUser
 * @apiGroup User
 *
 * @apiParam {Number} id Users ID.
 */
  .delete(
    middlewares.checkId,
    auth.keycloak.protect('realm:admin'),
    async (req, res, next) => {
      try {
        // TODO
        User.remove(req.params.id)
        res.status(status.OK).json({ id: req.params.id })
      } catch (err) {
        next(err)
      }
    })

module.exports = router
