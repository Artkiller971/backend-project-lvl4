const BaseModel = require('./basemodel.cjs');
const objectionUnique = require('objection-unique');
const encrypt = require('../lib/secure.cjs');

const unique = objectionUnique({ fields: ['email'] });
const regExpForEmail = '^([a-zA-Z0-9_]+@)([a-zA-Z0-9_]+.)([a-zA-Z0-9_])+$';

module.exports = class User extends unique(BaseModel) {
  static get tableName() {
    return 'users';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['firstName', 'lastName', 'email', 'password'],
      properties: {
        id: { type: 'integer' },
        firstName: {type: 'string', minLength: 1},
        lastName: {type: 'string', minLength: 1},
        email: {type: 'string', pattern: regExpForEmail, minLength: 1},
        password: { type: 'string', minLength: 3 },
      },
    };
  }

  set password(value) {
    this.passwordDigest = encrypt(value);
  }

  verifyPassword(password) {
    return encrypt(password) === this.passwordDigest;
  }
}