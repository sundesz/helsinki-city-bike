import { ConnectionError, Sequelize } from 'sequelize';
import { SequelizeStorage, Umzug } from 'umzug';
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_USER } from '../config';
import { logErrorMessage } from '../utils';

export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: 'postgres',
  dialectOptions: {
    // ssl: {
    //   require: true,
    //   rejectUnauthorized: false,
    // },
  },
  logging: process.env.NODE_ENV === 'production' ? false : console.log,
});

const migrationConf = {
  migrations: { glob: 'src/db/migrations/*.ts' },
  storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
  context: sequelize.getQueryInterface(),
  logger: console,
};

const umzug = new Umzug(migrationConf);

const runMigrations = async () => {
  try {
    const migrator = umzug;
    const migrations = await migrator.up();
    console.log('Migrations upto date', {
      files: migrations.map((file) => file.name),
    });
  } catch (error: unknown) {
    logErrorMessage(error);
    console.log('failed to migrate:', error);
  }
};

export const rollbackMigrations = async () => {
  try {
    await sequelize.authenticate();
    const migrator = umzug;
    await migrator.down();
  } catch (error: unknown) {
    logErrorMessage(error);
    console.log('failed to rollback:', error);
  }
};

export const connectToDB = async () => {
  try {
    await sequelize.authenticate();
    await runMigrations();

    console.log('Database connected');
  } catch (error: unknown) {
    error instanceof ConnectionError
      ? logErrorMessage(error.message)
      : logErrorMessage(error);

    console.log('Connecting to database failed: ', error);
    return process.exit(1);
  }

  return null;
};

export type Migration = typeof umzug._types.migration;
