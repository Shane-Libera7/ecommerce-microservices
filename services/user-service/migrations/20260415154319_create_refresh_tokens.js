/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('refresh_tokens', function(table) {
        table.increments('id')
        table.text('token').notNullable()
        table.integer('user_id').unsigned().notNullable()
        table.foreign('user_id').references('users.id')
        table.timestamps(true, true)

    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};
