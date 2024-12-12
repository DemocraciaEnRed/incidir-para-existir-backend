const { sequelize, Sequelize } = require('../models');
const {Umzug, SequelizeStorage} = require('umzug')

const umzugInstance = new Umzug({
  migrations: {
    glob: 'migrations/*.js'
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({sequelize}),
  logger: console,
})

async function migrate() {
  try {
    await umzugInstance.up()
    console.log('-- All migrations have been executed')
  } catch (error) {
    console.error('-- There was an error migrating the database!')
    console.error(error)
    console.log('- The app will now exit...')
    process.exit(1)
  }
}

async function checkPendingMigrations() {
  console.log(`- Checking database migrations...`);
  const pendingMigrations = await umzugInstance.pending()
  if (pendingMigrations.length > 0) {
    console.log(`-- There are ${pendingMigrations.length} pending migrations:`)
    console.log(pendingMigrations.map(m => m.name))
  } else {
    console.log('-- There are no pending migrations');
  }
}

const migrations = {
  umzug: umzugInstance,
  migrate,
  checkPendingMigrations
}

module.exports = migrations