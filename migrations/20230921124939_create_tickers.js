/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('tickers', function (table) {
    table.increments('id').primary()
    table.string('name')
    table.decimal('last', 10, 2)
    table.decimal('buy', 10, 2)
    table.decimal('sell', 10, 2)
    table.decimal('volume', 10, 2)
    table.string('base_unit')
  })

  //end here
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('tickers')
}
