export const up = (knex) => (
  knex.schema.createTable('tasks', (table) => {
    table.increments('id').primary();
    table.string('name');
    table.string('description');

    table.integer('status_id')
      .unsigned()
      .references('id')
      .inTable('statuses')
      .onDelete('SET NULL')
      .index();

    table.integer('creator_id')
      .unsigned()
      .references('id')
      .inTable('users')
      .onDelete('SET NULL')
      .index();

    table.integer('executor_id')
      .unsigned()
      .references('id')
      .inTable('users')
      .onDelete('SET NULL')
      .index();

    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  })
);

export const down = (knex) => knex.schema.dropTable('tasks');
