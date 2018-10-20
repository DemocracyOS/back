const { Types: { ObjectId } } = require('mongoose')
const { merge } = require('lodash/object')
const Document = require('../models/document')
const DocumentVersion = require('../models/documentVersion')
const Comment = require('../models/comment')
const validator = require('../services/jsonSchemaValidator')
const errors = require('../services/errors')

exports.countAuthorDocuments = async function countAuthorDocuments (author) {
  return Document.count({ author: author })
}

exports.isAuthor = async function isAuthor (id, author) {
  let count = await Document.countDocuments({ _id: id, author: author })
  return count
}

// Create document
exports.create = async function create (documentData, customForm) {
  // Check if the data is valid
  validator.isDataValid(
    customForm.fields,
    documentData.content
  )
  // Create a new document
  let documentToSave = {
    author: documentData.author,
    customForm: customForm._id,
    published: documentData.published,
    lastVersion: 1
  }
  // Save the document, to get the id
  let theDocument = await (new Document(documentToSave)).save()
  // Create a new version
  let versionToSave = {
    document: theDocument._id,
    version: 1,
    content: documentData.content,
    contributions: []
  }

  let theVersion = await (new DocumentVersion(versionToSave)).save()
  theDocument.content = theVersion.content
  return theDocument
}

// Get document (with its last version)
exports.get = async function get (query) {
  let document = await Document.findOne(query).populate('author').lean()
  let queryVersion = {
    document: document._id,
    version: document.lastVersion
  }
  let lastVersion = await DocumentVersion.findOne(queryVersion)
  document.content = lastVersion.content
  console.log(lastVersion)
  return document
}

// List documents
exports.list = async function list (query, { limit, page }) {
  let documentList = await Document.paginate(query, { page, limit, lean: true })
  let promisesPopulate = documentList.docs.map(async (doc) => {
    let theVersion = await DocumentVersion.findOne({
      document: doc._id,
      version: doc.lastVersion
    }).lean()
    let aux = doc
    aux.content = theVersion.content
    return aux
  })
  let populatedDocs = await Promise.all(promisesPopulate)
  documentList.docs = populatedDocs
  return documentList
}

// Update document
exports.update = async function update (id, document, customForm) {
  // First, find if the document exists
  return Document.findOne({ _id: id })
    .then((_document) => {
      // Founded?
      if (!_document) throw errors.ErrNotFound('Document to update not found')
      // Deep merge the change(s) with the document
      let documentToSave = merge(_document, document)
      // Validate the data
      validator.isDataValid(
        customForm.fields,
        documentToSave.content
      )
      // Save!
      return documentToSave.save()
    })
}

// Update document
exports.updateField = async function updateField (id, field, state, hash) {
  // First, find if the document exists
  return Document.findOne({ _id: id })
    .then((_document) => {
      // Found?
      if (!_document) throw errors.ErrNotFound('Document to update not found')
      // Deep merge the change(s) with the document
      _document.content[field] = state
      _document.content.hashes[field] = hash
      // Validate the data
      // Save!
      return _document.save()
    })
}

exports.remove = function remove (id) {
  return Document.findOne({ _id: id })
    .then((document) => {
      if (!document) throw errors.ErrNotFound('Document to remove not found')
      document.remove()
    })
}
