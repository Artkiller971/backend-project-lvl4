const BaseModel = require('./BaseModel.cjs');

module.exports = class Status extends BaseModel {
  static get tableName() {
    return 'statuses';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name'],
      properties: {
        id: { type: 'integer' },
        name: { type: 'string', minLength: 1 },
      },
    };
  }

  static get relationMappings() {
    const Task = require('./Task.cjs');

    return {
      tasks: {
        relation: BaseModel.HasManyRelation,
        modelClass: Task,
        join: {
          from: 'statuses.id',
          to: 'tasks.statusId',
        },
      },
    };
  }

};
