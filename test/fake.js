const faker = require('faker')
// const { Types: { ObjectId } } = require('mongoose')

const community = (userProfileSchemaId) => {
  return {
    name: 'Platform for ' + faker.address.city(),
    mainColor: faker.internet.color(),
    logo: null,
    user: null,
    userProfileSchema: userProfileSchemaId,
    initialized: true
  }
}

const user = (keycloak, username, fields) => {
  return {
    keycloak: keycloak || 'e331dbef-3283-42d9-9f39-0f9810ddc939',
    username: username || null,
    fields: fields || null
  }
}

const userProfileCustomForm = () => {
  return {
    name: faker.lorem.words(4),
    icon: faker.lorem.word(),
    description: faker.lorem.sentence(10),
    fields: userProfileSchema()
  }
}

const userProfileSchema = (valid) => {
  return {
    required: [],
    blocks: [
      {
        fields: [
          'twitter',
          'facebook'
        ],
        name: 'Social Media'
      },
      {
        fields: [
          'bio'
        ],
        name: 'About you'
      }
    ],
    properties: {
      bio: {
        type: 'string',
        title: 'User information'
      },
      twitter: {
        type: 'string',
        title: "User's surname"
      },
      facebook: {
        type: 'string',
        title: "User's facebook"
      }
    }
  }
}

const customForm = (valid) => {
  return {
    name: faker.lorem.words(4),
    icon: faker.lorem.word(),
    description: faker.lorem.sentence(10),
    fields: {
      blocks: [
        {
          name: 'Authors contact info',
          fields: [
            'authorEmail',
            'authorName',
            'authorSurname'
          ]
        },
        {
          name: 'Organization info',
          fields: [
            'orgEmail',
            'orgAdress',
            'orgTel'
          ]
        },
        {
          name: 'The content info',
          fields: [
            'introduction'
          ]
        }
      ],
      properties: {
        'authorName': {
          type: 'string',
          title: "Author's name"
        },
        'authorSurname': {
          type: 'string',
          title: "Author's surname"
        },
        'authorEmail': {
          type: valid !== undefined && !valid ? 'strong' : 'string',
          title: "Author's email"
        },
        'orgTel': {
          type: 'string',
          title: "Org's tel"
        },
        'orgEmail': {
          type: valid !== undefined && !valid ? 'strong' : 'string',
          title: "Org's email"
        },
        'orgAdress': {
          type: 'string',
          title: "Org's address"
        },
        'introduction': {
          type: 'string',
          title: 'Some introduction'
        }
      },
      required: [
        'authorName',
        'authorSurname',
        'authorEmail',
        'introduction'
      ],
      richText: ['introduction'],
      allowComments: [
        'introduction'
      ]
    }
  }
}

const document = (valid, published, authorId, customFormId) => {
  return {
    author: authorId || '5b9297921388502c145a952e',
    published: published || false,
    customForm: customFormId || null,
    content: {
      title: faker.lorem.words(4),
      brief: faker.lorem.sentence(12),
      fields: {
        authorName: valid !== undefined && !valid ? faker.random.number() : faker.name.firstName(),
        authorSurname: faker.name.lastName(),
        authorEmail: faker.internet.email(),
        orgTel: valid !== undefined && !valid ? faker.random.number() : faker.company.companyName(),
        introduction: faker.lorem.paragraphs(3)
      }
    }
  }
}

const generalComment = (documentId, userId, field) => {
  return {
    field: field || 'introduction',
    comment: faker.lorem.sentence(12)
  }
}

module.exports = {
  community,
  customForm,
  document,
  generalComment,
  userProfileSchema,
  userProfileCustomForm,
  user
}
