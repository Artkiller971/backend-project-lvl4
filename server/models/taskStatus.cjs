const BaseModel = require('./basemodel.cjs');
const objectionUnique = require('objection-unique');

const unique = objectionUnique({ fields: ['name'] });

module.exports = class TaskStatus extends unique(BaseModel) {
  static get tableName() {
    return 'statuses';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name'],
      properties: {
        id: { type: 'integer'},
        name: { type: 'string', minLength: 1 },
      },
    }
  };
}