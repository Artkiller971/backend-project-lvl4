const BaseModel = require('./BaseModel.cjs');

module.exports = class Task extends BaseModel {
  static get tableName() {
    return 'tasks';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name', 'statusId', 'creatorId'],
      properties: {
        id: { type: 'integer' },
        name: { type: 'string', minLength: 1 },
        description: { type: 'string' },
        statusId: { type: 'integer' },
        creatorId: { type: 'integer' },
        executorId: { type: 'number', nullable: true },
      },
    };
  }

  static get relationMappings() {
    const User = require('./User.cjs');
    const Status = require('./Status.cjs');
    const Label = require('./Label.cjs');

    return {
      status: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: Status,
        join: {
          from: 'tasks.statusId',
          to: 'statuses.id',
        },
      },

      creator: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'tasks.creatorId',
          to: 'users.id',
        },
      },

      executor: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'tasks.executorId',
          to: 'users.id',
        },
      },

      labels: {
        relation: BaseModel.ManyToManyRelation,
        modelClass: Label,
        join: {
          from: 'tasks.id',
          through: {
            from: 'tasks_labels.taskId',
            to: 'tasks_labels.labelId',
          },
          to: 'labels.id',
        },
      },
    };
  }

  static modifiers = {
    filterByStatus(builder, id = '') {
      if (id !== '') {
        builder.where('statusId', id);
      }
    },

    filterByExecutor(builder, id = '') {
      if (id !== '') {
        builder.where('executorId', id);
      }
    },

    filterByLabel(builder, id = '') {
      if (id !== '') {
        builder.where('labels.id', id);
      }
    },

    filterOwn(builder, id = '') {
      if (id !== '') {
        builder.where('creatorId', id);
      }
    },
  };
};
