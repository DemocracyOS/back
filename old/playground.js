console.log('======================================')
console.log('Testing JSON Schema & AJValidator')
console.log('======================================')

let Ajv = require('ajv')
let localize = require('ajv-i18n')
let ajv = Ajv({ allErrors: true })

const isDataValid = (schema, data) => {
  let validate = ajv.compile(schema)
  let valid = validate(data)
  console.log('Is data valid? ' + valid)
  if (!valid) {
    console.log('Reasons: ')

    // es for Russian
    localize.es(validate.errors)
    // string with all errors and data paths
    console.log(ajv.errorsText(validate.errors, { separator: '\n' }))
  }
}

let schema = {
  'properties': {
    'domicilio': {
      'type': 'string',
      'maxLength': 150
    },
    'num_secretaria': { 'type': 'string' },
    'tel_secretaria': { 'type': 'string' },
    'encargado': {
      'type': 'string',
      'maxLength': 50
    }
  }
}

const example = {
  "name": "CV basic data",
  "icon": "fa-file-o",
  "description": "This are data that every CV should have needed for a CV",
  "fields": {
    "blocks": [
      {
        "name": "Authors contact info",
        "fields": [
          "authorEmail",
          "authorName",
          "authorSurname"
        ]
      },
      {
        "name": "Org info",
        "fields": [
          "orgEmail",
          "orgAdress",
          "orgTel"
        ]
      }
    ],
    "properties": {
      "authorName": {
        "type": "string",
        "title": "Author's name"
      },
      "authorSurname": {
        "type": "string",
        "title": "Author's surname"
      },
      "authorEmail": {
        "type": "string",
        "title": "Author's email"
      },
      "orgTel": {
        "type": "string",
        "title": "Author's tel"
      },
      "orgEmail": {
        "type": "string",
        "title": "Author's email"
      },
      "orgAdress": {
        "type": "string",
        "title": "Author's address"
      }
    },
    "required": [
      "authorName",
      "authorSurname",
      "authorEmail"
    ]
  }
} 

let data = {
  'domicilio': 'San Lorenzo 2516, 9B - Puerta izquierda',
  'num_secretaria': 20,
  'tel_secretaria': '+54 9 342124555',
  'encargado': 'Maria Cecilia'
}

console.log('Example schema:')
console.log(schema)
console.log('======================================')
console.log('Data:')
console.log(data)
console.log('======================================')
let validSchema = ajv.validateSchema(schema)
console.log('Is the schema valid? ' + validSchema)
console.log('======================================')
isDataValid(schema, data)
console.log('======================================')
data.num_secretaria = '20-B'
console.log('Data:')
console.log(data)
console.log('======================================')
isDataValid(schema, data)
console.log('======================================')
