const { Types: { ObjectId } } = require('mongoose')
// const { ErrNotFound } = require('../services/errors')
const Document = require('../models/document')
const DocumentType = require('../models/documentType')
const log = require('../services/logger')
const validator = require('../services/jsonSchemaValidator')

// Create document
exports.create = async function create (document) {
  const documentType = await DocumentType.findOne({})
  validator.isDataValid(
    documentType.fields,
    document.content.fields
  )
  return (new Document(document)).save()
}

// Get document
exports.get = function get () {
  return Document.findOne({})
}

// List documents
exports.list = function list ({ limit, page, ids }) {
  let query = {}
  return Document
    .paginate(query, { page, limit })
}

// Update document
// exports.update = function update (document) {
//   if (document.fields) {
//     validator.isSchemaValid({
//       properties: document.fields.properties,
//       required: document.fields.required
//     })
//   }
//   return Document.findOne({})
//     .then((_document) => {
//       if (!_document) throw ErrNotFound('Document to update not found')
//       return Object.assign(_document, document).save()
//     })
// }
