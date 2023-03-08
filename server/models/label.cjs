const BaseModel = require('./basemodel.cjs');
const objectionUnique = require('objection-unique');

const unique = objectionUnique({ fields: ['name'] });

module.exports = class Label extends unique(BaseModel) {
  static get tableName() {
    return 'labels';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name'],
      properties: {
        id: { type : 'integer' },
        name: { type: 'string', minLength: 1},
      }
    }
  }

  static get relationalMappings() {

    const Task = require('./task.cjs')

    return {
      tasks: {
        relation: BaseModel.ManyToManyRelation,
        modelClass: Task,
        join: {
          from: 'labels.id',
          through: {
            from: 'labels_tasks.labelId',
            to: 'labels_tasks.taskId',
          },
          to: 'tasks.id'
        }
      }
    }

  }
}