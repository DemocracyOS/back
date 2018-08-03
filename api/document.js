const status = require('http-status')
const express = require('express')
const Document = require('../db-api/document')
const DocumentType = require('../db-api/documentType')
const DocumentTypeVersion = require('../db-api/documentTypeVersion')
const router = express.Router()
const auth = require('../services/auth')
const errors = require('../services/errors')
const log = require('../services/logger')
const middlewares = require('../services/middlewares')
// const {
//   ErrMissingParam,
//   ErrNotFound,
//   ErrParamTooLong
// } = require('../services/errors')
router.route('/')
  /**
   * @api {get} /documents List documents
   * @apiName getDocuments
   * @apiGroup Document
   */
  .get(
    async (req, res, next) => {
      try {
        const results = await Document.list({}, {
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
   * @api {post} /documents Create a new document
   * @apiName postDocument
   * @apiGroup Document
   */
  .post(
    auth.keycloak.protect('realm:accountable'),
    async (req, res, next) => {
      try {
        const documentType = await DocumentType.get()
        const newDocument = await Document.create(req.body, documentType)
        res.send(status.CREATED, newDocument)
      } catch (err) {
        next(err)
      }
    })
router.route('/:id')
  /**
   * @api {get} /documents/:id Gets a document
   * @apiName getDocument
   * @apiGroup Document
   *
   * @apiParam {Number} id Documents ID.
   */
  .get(
    middlewares.checkId,
    async (req, res, next) => {
      try {
        const document = await Document.get({ _id: req.params.id })
        if (!document) throw errors.ErrNotFound('Document not found or doesn\'t exist')
        if (!document.published) {
          // It's a draft, check if the author is the user who requested it.
          if (document.authorId === auth.getUserId(req)) {
            // True! Deliver the document
            res.status(status.OK).json(document)
          } else {
            // No, Then the user shouldn't be asking for this document.
            throw errors.ErrForbidden
          }
        }
        res.status(status.OK).json(document)
      } catch (err) {
        next(err)
      }
    })
  /**
   * @api {put} /documents/:id Updates a document
   * @apiName putDocument
   * @apiGroup Document
   *
   * @apiParam {Number} id Documents ID.
   */
  .put(
    middlewares.checkId,
    auth.keycloak.protect('realm:accountable'),
    async (req, res, next) => {
      try {
        // Check if the user is the author of the document
        const document = await Document.get({ _id: req.params.id })
        if (!(document.authorId === auth.getUserId(req))) {
          throw errors.ErrForbidden
        }
        const documentType = await DocumentTypeVersion.getVersion(document.documentTypeVersion)
        const updatedDocumentType = await Document.update(req.body, documentType)
        res.status(status.OK).json(updatedDocumentType)
        // res.status(status.IM_A_TEAPOT).json({a: 'b'})
      } catch (err) {
        next(err)
      }
    })
  /**
   * @api {delete} /documents/:id Delets a document
   * @apiName deleteDocument
   * @apiGroup Document
   *
   * @apiParam {Number} id Documents ID.
   */
  .delete(
    middlewares.checkId,
    auth.keycloak.protect('realm:accountable'),
    async (req, res, next) => {
      try {
        // TODO
        // res.status(status.OK).json({ id: req.params.id })
      } catch (err) {
        next(err)
      }
    })

module.exports = router