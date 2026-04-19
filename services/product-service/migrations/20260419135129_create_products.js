/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('products', function(table) {
        table.increments('id')
        table.string('name').notNullable().unique()
        table.integer('price').notNullable()
        table.integer('inventory').notNullable()
        table.integer('category_id').unsigned()
        table.foreign('category_id').references('categories.id')
        table.string('description')
        table.timestamps(true, true)
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};
